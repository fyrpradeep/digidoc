import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Otp } from './schemas/otp.schema';
import { Patient } from '../patients/schemas/patient.schema';
import { Doctor } from '../doctors/schemas/doctor.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name)     private otpModel:     Model<Otp>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name)  private doctorModel:  Model<Doctor>,
    private jwt: JwtService,
  ) {}

  private clean(m: string) { return m.replace(/\D/g, '').slice(-10); }

  private signToken(payload: any) {
    return {
      token:   this.jwt.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' }),
      refresh: this.jwt.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }),
    };
  }

  // ── SEND OTP ────────────────────────────────────────────────────
  async sendOtp(mobile: string) {
    const num = this.clean(mobile);
    if (num.length < 10) throw new BadRequestException('Invalid mobile number');

    // Rate limit: max 3 attempts in 10 min
    const existing = await this.otpModel.findOne({ mobile: num });
    if (existing && existing.attempts >= 3) throw new BadRequestException('Too many OTP requests. Wait 10 minutes.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpModel.deleteMany({ mobile: num });
    await this.otpModel.create({
      mobile: num, otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
    });

    console.log(`📱 OTP [${num}]: ${otp}`);
    // TODO: SMS via MSG91
    // await this.smsService.send(num, `Your PMCare OTP is ${otp}. Valid for 10 minutes.`);

    return {
      success:  true,
      message:  'OTP sent successfully',
      dev_otp:  process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  // ── VERIFY OTP ──────────────────────────────────────────────────
  async verifyOtp(mobile: string, otp: string) {
    const num = this.clean(mobile);
    const rec = await this.otpModel.findOne({ mobile: num });
    if (!rec) throw new BadRequestException('Please request OTP first');
    if (new Date() > rec.expiresAt) { await this.otpModel.deleteMany({ mobile: num }); throw new BadRequestException('OTP expired'); }
    if (rec.otp !== otp) {
      await this.otpModel.updateOne({ mobile: num }, { $inc: { attempts: 1 } });
      throw new UnauthorizedException('Wrong OTP');
    }
    await this.otpModel.deleteMany({ mobile: num });

    // Check existing user
    const patient = await this.patientModel.findOne({ mobile: num });
    if (patient) {
      if (patient.status === 'blocked') throw new UnauthorizedException('Account blocked. Contact support.');
      const tokens = this.signToken({ sub: patient._id, role: 'patient', mobile: num });
      return { ...tokens, user: patient, role: 'patient', isNew: false };
    }

    const doctor = await this.doctorModel.findOne({ mobile: num });
    if (doctor) {
      if (doctor.status === 'blocked') throw new UnauthorizedException('Account blocked. Contact support.');
      const tokens = this.signToken({ sub: doctor._id, role: 'doctor', mobile: num });
      return { ...tokens, user: doctor, role: 'doctor', isNew: false, isPending: doctor.status === 'pending' };
    }

    return { isNew: true, mobile: num };
  }

  // ── PATIENT REGISTER ────────────────────────────────────────────
  async registerPatient(mobile: string, name: string, email?: string) {
    const num = this.clean(mobile);
    const existing = await this.patientModel.findOne({ mobile: num });
    if (existing) throw new ConflictException('Mobile already registered');

    const patient = await this.patientModel.create({
      mobile: num, name, email: email || '', status: 'active',
    });

    console.log(`✅ Patient registered: ${name} (${num})`);
    const tokens = this.signToken({ sub: patient._id, role: 'patient', mobile: num });
    return { ...tokens, user: patient, role: 'patient' };
  }

  // ── DOCTOR REGISTER ─────────────────────────────────────────────
  async registerDoctor(mobile: string, name: string, email?: string) {
    const num = this.clean(mobile);
    const existing = await this.doctorModel.findOne({ mobile: num });
    if (existing) throw new ConflictException('Mobile already registered');

    const doctor = await this.doctorModel.create({
      mobile: num, name, email: email || '',
      status: 'pending',   // Admin approval needed
      isOnline: false,
    });

    console.log(`⏳ Doctor PENDING APPROVAL: ${name} (${num})`);
    const tokens = this.signToken({ sub: doctor._id, role: 'doctor', mobile: num });
    return { ...tokens, user: doctor, role: 'doctor', isPending: true };
  }

  // ── GOOGLE OAUTH ────────────────────────────────────────────────
  async googleLogin(googleUser: any, role: 'patient' | 'doctor') {
    const { googleId, email, name, photo } = googleUser;

    if (role === 'patient') {
      let patient = await this.patientModel.findOne({ $or: [{ googleId }, { email }] });
      if (!patient) {
        patient = await this.patientModel.create({ googleId, email, name, photo, status: 'active' });
        console.log(`✅ Patient via Google: ${name}`);
      } else {
        if (!patient.googleId) await this.patientModel.updateOne({ _id: patient._id }, { googleId, photo });
        if (patient.status === 'blocked') throw new UnauthorizedException('Account blocked.');
      }
      const tokens = this.signToken({ sub: patient._id, role: 'patient', email });
      return { ...tokens, user: patient, role: 'patient', isNew: false };
    }

    if (role === 'doctor') {
      let doctor = await this.doctorModel.findOne({ $or: [{ googleId }, { email }] });
      if (!doctor) {
        doctor = await this.doctorModel.create({ googleId, email, name, photo, status: 'pending' });
        console.log(`⏳ Doctor via Google PENDING: ${name}`);
      } else {
        if (!doctor.googleId) await this.doctorModel.updateOne({ _id: doctor._id }, { googleId, photo });
        if (doctor.status === 'blocked') throw new UnauthorizedException('Account blocked.');
      }
      const tokens = this.signToken({ sub: doctor._id, role: 'doctor', email });
      return { ...tokens, user: doctor, role: 'doctor', isPending: doctor.status === 'pending' };
    }
  }

  // ── PASSWORD LOGIN ──────────────────────────────────────────────
  async loginWithPassword(identifier: string, password: string) {
    // identifier = mobile or email
    const patient = await this.patientModel.findOne({
      $or: [{ mobile: this.clean(identifier) }, { email: identifier }]
    });
    if (patient) {
      if (patient.status === 'blocked') throw new UnauthorizedException('Account blocked.');
      if (!patient.password) throw new BadRequestException('Password not set. Use OTP login.');
      const valid = await bcrypt.compare(password, patient.password);
      if (!valid) throw new UnauthorizedException('Wrong password');
      const tokens = this.signToken({ sub: patient._id, role: 'patient' });
      return { ...tokens, user: patient, role: 'patient' };
    }

    const doctor = await this.doctorModel.findOne({
      $or: [{ mobile: this.clean(identifier) }, { email: identifier }]
    });
    if (doctor) {
      if (doctor.status === 'blocked') throw new UnauthorizedException('Account blocked.');
      if (!doctor.password) throw new BadRequestException('Password not set. Use OTP login.');
      const valid = await bcrypt.compare(password, doctor.password);
      if (!valid) throw new UnauthorizedException('Wrong password');
      const tokens = this.signToken({ sub: doctor._id, role: 'doctor' });
      return { ...tokens, user: doctor, role: 'doctor', isPending: doctor.status === 'pending' };
    }

    throw new UnauthorizedException('User not found');
  }

  // ── SET PASSWORD ────────────────────────────────────────────────
  async setPassword(userId: string, role: string, password: string) {
    const hashed = await bcrypt.hash(password, 12);
    if (role === 'patient') {
      await this.patientModel.updateOne({ _id: userId }, { password: hashed });
    } else {
      await this.doctorModel.updateOne({ _id: userId }, { password: hashed });
    }
    return { success: true };
  }

  // ── ADMIN LOGIN ─────────────────────────────────────────────────
  async adminLogin(email: string, password: string) {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
      throw new UnauthorizedException('Invalid admin credentials');
    const tokens = this.signToken({ sub: 'admin', role: 'admin' });
    return { ...tokens, role: 'admin', user: { name: 'Admin', email } };
  }

  // ── STAFF LOGIN ─────────────────────────────────────────────────
  async staffLogin(email: string, password: string) {
    // Staff created by admin — stored in DB
    // Import StaffModel here if needed
    throw new BadRequestException('Staff login via admin panel');
  }

  // ── PHARMA LOGIN ────────────────────────────────────────────────
  async pharmaLogin(email: string, password: string) {
    throw new BadRequestException('Pharma login via admin panel');
  }

  // ── LIVE STATS (for home page) ──────────────────────────────────
  async getStats() {
    const [doctors, patients] = await Promise.all([
      this.doctorModel.countDocuments({ status: 'approved' }),
      this.patientModel.countDocuments({ status: 'active' }),
    ]);
    return { doctors, patients };
  }
}
