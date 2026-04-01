import { Module }  from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService }    from './auth.service';
import { OtpEntity }      from './otp.entity';
import { PatientEntity }  from '../patients/patient.entity';
import { DoctorEntity }   from '../doctors/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity, PatientEntity, DoctorEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret:      config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES', '7d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService],
  exports:     [AuthService, JwtModule],
})
export class AuthModule {}
