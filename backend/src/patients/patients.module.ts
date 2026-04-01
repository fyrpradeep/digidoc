import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PatientEntity } from './patient.entity';
import { PatientsController } from './patients.controller';
import { PatientsService }    from './patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity]), JwtModule],
  controllers: [PatientsController],
  providers:   [PatientsService],
  exports:     [PatientsService],
})
export class PatientsModule {}
