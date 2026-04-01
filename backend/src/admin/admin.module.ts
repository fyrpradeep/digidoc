import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService }    from './admin.service';
import { DoctorsModule }   from '../doctors/doctors.module';
import { PatientsModule }  from '../patients/patients.module';
import { OrdersModule }    from '../orders/orders.module';
import { MedicinesModule } from '../medicines/medicines.module';
@Module({
  imports: [JwtModule, DoctorsModule, PatientsModule, OrdersModule, MedicinesModule],
  controllers: [AdminController],
  providers:   [AdminService],
})
export class AdminModule {}
