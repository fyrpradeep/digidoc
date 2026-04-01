import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../common/guards/jwt.guard';
@Controller('payments')
@UseGuards(JwtGuard)
export class PaymentsController {
  constructor(private svc: PaymentsService) {}
  @Post('create-order')  createOrder(@Body() b: { amount: number }) { return this.svc.createOrder(b.amount); }
  @Post('verify')        verify(@Body() b: { orderId: string; paymentId: string; signature: string }) {
    return this.svc.verifyPayment(b.orderId, b.paymentId, b.signature);
  }
}
