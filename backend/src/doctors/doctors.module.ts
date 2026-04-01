import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DoctorEntity }      from './doctor.entity';
import { DoctorsController } from './doctors.controller';
import { DoctorsService }    from './doctors.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity]), JwtModule],
  controllers: [DoctorsController],
  providers:   [DoctorsService],
  exports:     [DoctorsService],
})
export class DoctorsModule {}
