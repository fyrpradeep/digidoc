import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { Prescription, PrescriptionSchema } from './schemas/prescription.schema';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [MongooseModule.forFeature([{ name: Prescription.name, schema: PrescriptionSchema }]),JwtModule.register({secret:process.env.JWT_SECRET||'digidoc_secret'})],
  controllers: [PrescriptionsController], providers: [PrescriptionsService], exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
