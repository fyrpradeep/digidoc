import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Doctor.name,schema:DoctorSchema},{name:Patient.name,schema:PatientSchema},{name:Payment.name,schema:PaymentSchema},{name:Order.name,schema:OrderSchema}])],
  controllers: [ReportsController], providers: [ReportsService],
})
export class ReportsModule {}
