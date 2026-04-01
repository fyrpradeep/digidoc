import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
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

  private clean(m: string) { return m.replace(/\D/g,'').slice(-10); }

  async sendOtp(mobile: string) {
    const num = this.clean(mobile);
    if (num.length < 10) throw new BadRequestException('Invalid mobile number');
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    await this.otpModel.deleteMany({ mobile: num });
    await this.otpModel.create({ mobile: num, otp, expiresAt: new Date(Date.now()+10*60*1000) });
    console.log(`📱 OTP [${num}]: ${otp}`);
    // TODO: Add MSG91 SMS here when ready
    return {
      message: 'OTP sent successfully',
      dev_otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  async verifyOtp(mobile: string, otp: string) {
    const num = this.clean(mobile);
    const rec = await this.otpModel.findOne({ mobile: num });
    if (!rec) throw new BadRequestException('Please request OTP first');
    if (rec.otp !== otp) throw new UnauthorizedException('Invalid OTP');
    if (new Date() > rec.expiresAt) throw new BadRequestException('OTP expired. Request new one.');
    await this.otpModel.deleteMany({ mobile: num });

    const patient = await this.patientModel.findOne({ mobile: num });
    if (patient) {
      if (patient.status === 'blocked') throw new UnauthorizedException('Account blocked. Contact admin.');
      const token = this.jwt.sign({ sub: patient._id, role: 'patient', mobile: num });
      return { token, user: patient, role: 'patient', isNew: false };
    }

    const doctor = await this.doctorModel.findOne({ mobile: num });
    if (doctor) {
      if (doctor.status === 'blocked') throw new UnauthorizedException('Account blocked. Contact admin.');
      const token = this.jwt.sign({ sub: doctor._id, role: 'doctor', mobile: num });
      return { token, user: doctor, role: 'doctor', isNew: false };
    }

    return { isNew: true };
  }

  async completeRegistration(mobile: string, role: 'patient'|'doctor', name: string) {
    const num = this.clean(mobile);
    if (role === 'patient') {
      let p = await this.patientModel.findOne({ mobile: num });
      if (!p) p = await this.patientModel.create({ mobile: num, name, status: 'active' });
      const token = this.jwt.sign({ sub: p._id, role: 'patient', mobile: num });
      console.log(`✅ Patient registered: ${name} (${num})`);
      return { token, user: p, role: 'patient' };
    }
    if (role === 'doctor') {
      let d = await this.doctorModel.findOne({ mobile: num });
      if (!d) {
        d = await this.doctorModel.create({ mobile: num, name, status: 'pending', isOnline: false });
        console.log(`⏳ Doctor PENDING APPROVAL: ${name} (${num})`);
      }
      const token = this.jwt.sign({ sub: d._id, role: 'doctor', mobile: num });
      return { token, user: d, role: 'doctor', isPending: d.status === 'pending' };
    }
    throw new BadRequestException('Invalid role');
  }

  async adminLogin(email: string, password: string) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@digidoc.com';
    const adminPwd   = process.env.ADMIN_PASSWORD || 'DigiDoc@2026';
    if (email !== adminEmail || password !== adminPwd)
      throw new UnauthorizedException('Invalid credentials');
    const token = this.jwt.sign({ sub: 'admin', role: 'admin' });
    return { token, role: 'admin' };
  }
}
