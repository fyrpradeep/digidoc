import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),JwtModule.register({secret:process.env.JWT_SECRET||'digidoc_secret'})],
  controllers: [OrdersController], providers: [OrdersService], exports: [OrdersService],
})
export class OrdersModule {}
