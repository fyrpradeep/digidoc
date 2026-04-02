import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }, { name: Patient.name, schema: PatientSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'pmcare_jwt_secret' }),
  ],
  controllers: [AdminController], providers: [AdminService], exports: [AdminService],
})
export class AdminModule {}
