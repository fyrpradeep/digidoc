import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'pmcare_jwt_secret' }),
  ],
  controllers: [DoctorsController], providers: [DoctorsService],
  exports: [DoctorsService, MongooseModule],
})
export class DoctorsModule {}
