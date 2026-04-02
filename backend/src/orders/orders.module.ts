import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Order.name,schema:OrderSchema}]),JwtModule.register({secret:process.env.JWT_SECRET||'pmcare'})],
  controllers: [OrdersController], providers: [OrdersService], exports: [OrdersService],
})
export class OrdersModule {}
