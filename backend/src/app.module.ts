import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule }          from './auth/auth.module';
import { PatientsModule }      from './patients/patients.module';
import { DoctorsModule }       from './doctors/doctors.module';
import { AdminModule }         from './admin/admin.module';
import { AppointmentsModule }  from './appointments/appointments.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { OrdersModule }        from './orders/orders.module';
import { MedicinesModule }     from './medicines/medicines.module';
import { PaymentsModule }      from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CallModule }          from './call/call.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type:        'postgres',
      host:        'localhost',
      port:        5432,
      username:    'postgres',
      password:    'digidoc2026',
      database:    'digidoc',
      entities:    [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging:     false,
    }),
    AuthModule,
    PatientsModule,
    DoctorsModule,
    AdminModule,
    AppointmentsModule,
    PrescriptionsModule,
    OrdersModule,
    MedicinesModule,
    PaymentsModule,
    NotificationsModule,
    CallModule,      // ← WebSocket for video calls
  ],
})
export class AppModule {}
