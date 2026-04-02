import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Payment.name,schema:PaymentSchema}]),JwtModule.register({secret:process.env.JWT_SECRET||'pmcare'})],
  controllers: [PaymentsController], providers: [PaymentsService], exports: [PaymentsService],
})
export class PaymentsModule {}
