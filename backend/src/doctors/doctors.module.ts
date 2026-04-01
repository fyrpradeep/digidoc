import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'digidoc_secret' }),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService, MongooseModule],
})
export class DoctorsModule {}
