import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { JwtService }       from '@nestjs/jwt';
import { ConfigService }    from '@nestjs/config';
import { OtpEntity }        from './otp.entity';
import { PatientEntity }    from '../patients/patient.entity';
import { DoctorEntity }     from '../doctors/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OtpEntity)     private otpRepo:     Repository<OtpEntity>,
    @InjectRepository(PatientEntity) private patientRepo: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)  private doctorRepo:  Repository<DoctorEntity>,
    private jwtService:   JwtService,
    private configService: ConfigService,
  ) {}

  // ── Generate & send OTP ──────────────────────────────────────────
  async sendOtp(mobile: string): Promise<{ message: string; dev_otp?: string }> {
    // Clean mobile number
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (expires in 10 minutes)
    await this.otpRepo.delete({ mobile: cleanMobile });
    await this.otpRepo.save({
      mobile:    cleanMobile,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // ── TODO: Send real SMS via MSG91 ──────────────────────────────
    // Uncomment when MSG91 key is ready:
    // await this.sendSms(cleanMobile, otp);
    // ──────────────────────────────────────────────────────────────

    console.log(`📱 OTP for ${cleanMobile}: ${otp}`);

    return {
      message: 'OTP sent successfully',
      // Remove dev_otp in production!
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  // ── Verify OTP & return JWT ──────────────────────────────────────
  async verifyOtp(mobile: string, otp: string): Promise<{
    token: string;
    user: any;
    role: string;
    isNew: boolean;
  }> {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    // Find OTP record
    const record = await this.otpRepo.findOne({ where: { mobile: cleanMobile } });
    if (!record)                     throw new BadRequestException('OTP not found. Please request a new one.');
    if (record.verified)             throw new BadRequestException('OTP already used.');
    if (new Date() > record.expiresAt) throw new BadRequestException('OTP expired. Please request a new one.');
    if (record.otp !== otp)          throw new UnauthorizedException('Invalid OTP.');

    // Mark as verified
    await this.otpRepo.update(record.id, { verified: true });

    // Check if patient exists
    let patient = await this.patientRepo.findOne({ where: { mobile: cleanMobile } });
    if (patient) {
      const token = this.jwtService.sign({ sub: patient.id, role: 'patient', mobile: cleanMobile });
      return { token, user: patient, role: 'patient', isNew: false };
    }

    // Check if doctor exists
    let doctor = await this.doctorRepo.findOne({ where: { mobile: cleanMobile } });
    if (doctor) {
      const token = this.jwtService.sign({ sub: doctor.id, role: 'doctor', mobile: cleanMobile });
      return { token, user: doctor, role: 'doctor', isNew: false };
    }

    // New user — return temp token, frontend will ask for role
    const token = this.jwtService.sign({ mobile: cleanMobile, role: 'new' });
    return { token, user: null, role: 'new', isNew: true };
  }

  // ── Complete registration (new user picks role) ──────────────────
  async completeRegistration(mobile: string, role: 'patient' | 'doctor', name?: string) {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    if (role === 'patient') {
      const patient = this.patientRepo.create({ mobile: cleanMobile, name: name || '' });
      const saved   = await this.patientRepo.save(patient);
      const token   = this.jwtService.sign({ sub: saved.id, role: 'patient', mobile: cleanMobile });
      return { token, user: saved, role: 'patient' };
    }

    if (role === 'doctor') {
      const doctor = this.doctorRepo.create({ mobile: cleanMobile, name: name || '' });
      const saved  = await this.doctorRepo.save(doctor);
      const token  = this.jwtService.sign({ sub: saved.id, role: 'doctor', mobile: cleanMobile });
      return { token, user: saved, role: 'doctor' };
    }
  }

  // ── Admin login (username + password) ────────────────────────────
  async adminLogin(username: string, password: string) {
    const adminUser = this.configService.get('ADMIN_USERNAME', 'admin@digidoc.com');
    const adminPass = this.configService.get('ADMIN_PASSWORD', 'DigiDoc@2026');

    if (username !== adminUser || password !== adminPass) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    const token = this.jwtService.sign({ sub: 'admin', role: 'admin' });
    return { token, role: 'admin' };
  }

  // ── TODO: MSG91 SMS sender ────────────────────────────────────────
  // private async sendSms(mobile: string, otp: string) {
  //   const response = await fetch('https://api.msg91.com/api/v5/otp', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json', 'authkey': process.env.MSG91_API_KEY },
  //     body: JSON.stringify({ template_id: process.env.MSG91_TEMPLATE_ID, mobile: `91${mobile}`, otp }),
  //   });
  // }
}
