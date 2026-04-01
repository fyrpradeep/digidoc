import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule }         from './auth/auth.module';
import { DoctorsModule }      from './doctors/doctors.module';
import { PatientsModule }     from './patients/patients.module';
import { AdminModule }        from './admin/admin.module';
import { CallModule }         from './call/call.module';
import { OrdersModule }       from './orders/orders.module';
import { MedicinesModule }    from './medicines/medicines.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/digidoc'),
    AuthModule,
    DoctorsModule,
    PatientsModule,
    AdminModule,
    CallModule,
    OrdersModule,
    MedicinesModule,
    PrescriptionsModule,
  ],
})
export class AppModule {}
