import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PrescriptionEntity }    from './prescription.entity';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService }    from './prescriptions.service';
@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionEntity]), JwtModule],
  controllers: [PrescriptionsController],
  providers:   [PrescriptionsService],
  exports:     [PrescriptionsService],
})
export class PrescriptionsModule {}
