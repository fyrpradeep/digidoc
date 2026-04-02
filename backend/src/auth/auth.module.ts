import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GooglePatientStrategy } from './strategies/google-patient.strategy';
import { GoogleDoctorStrategy } from './strategies/google-doctor.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'pmcare_jwt_secret',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([
      { name: Otp.name,     schema: OtpSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name,  schema: DoctorSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GooglePatientStrategy, GoogleDoctorStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
