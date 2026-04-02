import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient, PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'pmcare_jwt_secret' }),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService, MongooseModule],
})
export class PatientsModule {}
