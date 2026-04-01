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
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {}

  private clean(m: string) { return m.replace(/\D/g,'').slice(-10); }

  async sendOtp(mobile: string) {
    const num = this.clean(mobile);
    if (num.length < 10) throw new BadRequestException('Invalid mobile');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpRepo.delete({ mobile: num });
    await this.otpRepo.save({ mobile: num, otp, expiresAt: new Date(Date.now() + 10*60*1000) });
    console.log(`📱 OTP [${num}]: ${otp}`);
    return { message: 'OTP sent', dev_otp: process.env.NODE_ENV !== 'production' ? otp : undefined };
  }

  async verifyOtp(mobile: string, otp: string) {
    const num = this.clean(mobile);
    const rec = await this.otpRepo.findOne({ where: { mobile: num } });
    if (!rec) throw new BadRequestException('Request OTP first');
    if (rec.otp !== otp) throw new UnauthorizedException('Wrong OTP');
    if (new Date() > rec.expiresAt) throw new BadRequestException('OTP expired');
    await this.otpRepo.delete({ mobile: num });
    const patient = await this.patientRepo.findOne({ where: { mobile: num } });
    if (patient) {
      return { token: this.jwt.sign({ sub: patient.id, role: 'patient' }), user: patient, role: 'patient', isNew: false };
    }
    const doctor = await this.doctorRepo.findOne({ where: { mobile: num } });
    if (doctor) {
      return { token: this.jwt.sign({ sub: doctor.id, role: 'doctor' }), user: doctor, role: 'doctor', isNew: false };
    }
    return { token: null, user: null, role: null, isNew: true };
  }

  // Both names work — controller may call either
  async completeRegistration(mobile: string, role: 'patient'|'doctor', name: string) {
    return this.register(mobile, role, name);
  }

  async register(mobile: string, role: 'patient'|'doctor', name: string) {
    const num = this.clean(mobile);
    if (role === 'patient') {
      let p = await this.patientRepo.findOne({ where: { mobile: num } });
      if (!p) p = await this.patientRepo.save(this.patientRepo.create({ mobile: num, name }));
      return { token: this.jwt.sign({ sub: p.id, role: 'patient' }), user: p, role: 'patient' };
    }
    let d = await this.doctorRepo.findOne({ where: { mobile: num } });
    if (!d) d = await this.doctorRepo.save(this.doctorRepo.create({ mobile: num, name, status: 'approved', isOnline: false }));
    return { token: this.jwt.sign({ sub: d.id, role: 'doctor' }), user: d, role: 'doctor' };
  }

  async adminLogin(email: string, password: string) {
    if (email !== 'admin@digidoc.com' || password !== 'DigiDoc@2026')
      throw new UnauthorizedException('Invalid credentials');
    return { token: this.jwt.sign({ sub: 'admin', role: 'admin' }), role: 'admin' };
  }
}
