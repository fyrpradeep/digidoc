import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpEntity } from './otp.entity';
import { PatientEntity } from '../patients/patient.entity';
import { DoctorEntity } from '../doctors/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OtpEntity)     private otpRepo:     Repository<OtpEntity>,
    @InjectRepository(PatientEntity) private patientRepo: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)  private doctorRepo:  Repository<DoctorEntity>,
    private jwtService:    JwtService,
    private configService: ConfigService,
  ) {}

  // ── Send OTP ──────────────────────────────────────────────────────
  async sendOtp(mobile: string) {
    const clean = mobile.replace(/\D/g, '').slice(-10);
    const otp   = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepo.delete({ mobile: clean });
    await this.otpRepo.save({
      mobile: clean, otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log(`📱 OTP for ${clean}: ${otp}`);

    // TODO: Uncomment when MSG91 key is ready
    // await this.sendSmsViaMSG91(clean, otp);

    return {
      message: 'OTP sent successfully',
      dev_otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  // ── Verify OTP ────────────────────────────────────────────────────
  async verifyOtp(mobile: string, otp: string) {
    const clean = mobile.replace(/\D/g, '').slice(-10);

    const record = await this.otpRepo.findOne({ where: { mobile: clean } });
    if (!record)                       throw new BadRequestException('OTP not found. Request a new one.');
    if (record.verified)               throw new BadRequestException('OTP already used.');
    if (new Date() > record.expiresAt) throw new BadRequestException('OTP expired.');
    if (record.otp !== otp)            throw new UnauthorizedException('Invalid OTP.');

    await this.otpRepo.update(record.id, { verified: true });

    // Check existing patient
    const patient = await this.patientRepo.findOne({ where: { mobile: clean } });
    if (patient) {
      const token = this.jwtService.sign({ sub: patient.id, role: 'patient', mobile: clean });
      return { token, user: patient, role: 'patient', isNew: false };
    }

    // Check existing doctor
    const doctor = await this.doctorRepo.findOne({ where: { mobile: clean } });
    if (doctor) {
      const token = this.jwtService.sign({ sub: doctor.id, role: 'doctor', mobile: clean });
      return { token, user: doctor, role: 'doctor', isNew: false };
    }

    // New user
    const token = this.jwtService.sign({ mobile: clean, role: 'new' });
    return { token, user: null, role: 'new', isNew: true };
  }

  // ── Complete Registration — SAVES to DB ───────────────────────────
  async completeRegistration(mobile: string, role: 'patient' | 'doctor', name?: string) {
    const clean = mobile.replace(/\D/g, '').slice(-10);

    if (role === 'patient') {
      // Check if already exists
      let patient = await this.patientRepo.findOne({ where: { mobile: clean } });
      if (!patient) {
        patient = await this.patientRepo.save(
          this.patientRepo.create({ mobile: clean, name: name || '' })
        );
        console.log(`✅ New patient registered: ${name} (${clean})`);
      }
      const token = this.jwtService.sign({ sub: patient.id, role: 'patient', mobile: clean });
      return { token, user: patient, role: 'patient' };
    }

    if (role === 'doctor') {
      let doctor = await this.doctorRepo.findOne({ where: { mobile: clean } });
      if (!doctor) {
        doctor = await this.doctorRepo.save(
          this.doctorRepo.create({ mobile: clean, name: name || '', status: 'approved', isOnline: false })
        );
        console.log(`✅ New doctor registered: ${name} (${clean})`);
      }
      const token = this.jwtService.sign({ sub: doctor.id, role: 'doctor', mobile: clean });
      return { token, user: doctor, role: 'doctor' };
    }

    throw new BadRequestException('Invalid role');
  }

  // ── Admin Login ───────────────────────────────────────────────────
  async adminLogin(username: string, password: string) {
    const adminUser = this.configService.get('ADMIN_USERNAME', 'admin@digidoc.com');
    const adminPass = this.configService.get('ADMIN_PASSWORD', 'DigiDoc@2026');
    if (username !== adminUser || password !== adminPass)
      throw new UnauthorizedException('Invalid admin credentials.');
    const token = this.jwtService.sign({ sub: 'admin', role: 'admin' });
    return { token, role: 'admin' };
  }
}
