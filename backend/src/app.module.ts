import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule }          from './auth/auth.module';
import { PatientsModule }      from './patients/patients.module';
import { DoctorsModule }       from './doctors/doctors.module';
import { AdminModule }         from './admin/admin.module';
import { StaffModule }         from './staff/staff.module';
import { PharmaModule }        from './pharma/pharma.module';
import { CallModule }          from './call/call.module';
import { ChatModule }          from './chat/chat.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicinesModule }     from './medicines/medicines.module';
import { OrdersModule }        from './orders/orders.module';
import { PaymentsModule }      from './payments/payments.module';
import { AppointmentsModule }  from './appointments/appointments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule }       from './reviews/reviews.module';
import { ReportsModule }       from './reports/reports.module';
import { CouponsModule }       from './coupons/coupons.module';
import { Doctor, DoctorSchema } from './doctors/schemas/doctor.schema';
import { Patient, PatientSchema } from './patients/schemas/patient.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/pmcare',
      { connectionFactory: (c) => { c.on('connected',()=>console.log('✅ MongoDB connected')); c.on('error',(e:any)=>console.log('❌ MongoDB:',e.message)); return c; } }
    ),
    MongooseModule.forFeature([{name:Doctor.name,schema:DoctorSchema},{name:Patient.name,schema:PatientSchema}]),
    AuthModule, PatientsModule, DoctorsModule, AdminModule,
    StaffModule, PharmaModule, CallModule, ChatModule,
    PrescriptionsModule, MedicinesModule, OrdersModule,
    PaymentsModule, AppointmentsModule, NotificationsModule,
    ReviewsModule, ReportsModule, CouponsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
