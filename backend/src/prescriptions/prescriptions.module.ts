import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { Prescription, PrescriptionSchema } from './schemas/prescription.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Prescription.name,schema:PrescriptionSchema}]),JwtModule.register({secret:process.env.JWT_SECRET||'pmcare'})],
  controllers: [PrescriptionsController], providers: [PrescriptionsService], exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
