import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrderEntity }      from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService }    from './orders.service';
@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), JwtModule],
  controllers: [OrdersController],
  providers:   [OrdersService],
  exports:     [OrdersService],
})
export class OrdersModule {}
