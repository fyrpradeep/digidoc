import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppointmentEntity }      from './appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService }    from './appointments.service';
@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity]), JwtModule],
  controllers: [AppointmentsController],
  providers:   [AppointmentsService],
  exports:     [AppointmentsService],
})
export class AppointmentsModule {}
