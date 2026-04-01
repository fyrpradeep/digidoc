import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const url = cfg.get<string>('DATABASE_URL');
        if (url) return { type:'postgres', url, ssl:{rejectUnauthorized:false}, entities:[__dirname+'/**/*.entity{.ts,.js}'], synchronize:true, logging:false };
        return { type:'postgres', host:cfg.get('DB_HOST','localhost'), port:cfg.get<number>('DB_PORT',5432), username:cfg.get('DB_USER','postgres'), password:cfg.get('DB_PASS','digidoc2026'), database:cfg.get('DB_NAME','digidoc'), entities:[__dirname+'/**/*.entity{.ts,.js}'], synchronize:true, logging:false };
      },
    }),
    AuthModule, PatientsModule, DoctorsModule, AdminModule,
    AppointmentsModule, PrescriptionsModule, OrdersModule,
    MedicinesModule, PaymentsModule, NotificationsModule, CallModule,
  ],
})
export class AppModule {}
