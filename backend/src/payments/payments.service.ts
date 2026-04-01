import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    private config: ConfigService,
    private ordersService: OrdersService,
  ) {}

  // ── TODO: Razorpay integration ────────────────────────────────────
  // When key is ready:
  // 1. npm install razorpay
  // 2. const Razorpay = require('razorpay');
  // 3. const razorpay = new Razorpay({ key_id: this.config.get('RAZORPAY_KEY_ID'), key_secret: this.config.get('RAZORPAY_SECRET') });
  // ─────────────────────────────────────────────────────────────────

  async createOrder(amount: number, currency = 'INR') {
    // TODO: Replace with real Razorpay order creation
    // const order = await razorpay.orders.create({ amount: amount * 100, currency, receipt: `receipt_${Date.now()}` });
    // return order;

    // Mock response for development
    return {
      id:       `order_mock_${Date.now()}`,
      amount:   amount * 100,
      currency: 'INR',
      status:   'created',
    };
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string) {
    // TODO: Verify Razorpay signature
    // const crypto = require('crypto');
    // const body   = orderId + '|' + paymentId;
    // const expected = crypto.createHmac('sha256', this.config.get('RAZORPAY_SECRET')).update(body).digest('hex');
    // if (expected !== signature) throw new BadRequestException('Invalid payment signature');

    // Update order payment status
    await this.ordersService.updatePayment(orderId, paymentId);
    return { success: true, paymentId };
  }
}
