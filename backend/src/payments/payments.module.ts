import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { PaymentsService }    from './payments.service';
import { OrdersModule }       from '../orders/orders.module';
@Module({
  imports: [JwtModule, OrdersModule],
  controllers: [PaymentsController],
  providers:   [PaymentsService],
})
export class PaymentsModule {}
