import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private model: Model<Payment>) {}

  async createRazorpayOrder(amount: number, type: string, patientId: string, refId: string) {
    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || keyId === 'PLACEHOLDER_ADD_WHEN_READY')
      throw new BadRequestException('Razorpay not configured yet');

    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await rzp.orders.create({
      amount:   amount * 100, // paise
      currency: 'INR',
      receipt:  `pmcare_${Date.now()}`,
    });

    // Save pending payment
    await this.model.create({
      patientId,
      amount,
      type,
      razorpayOrderId: order.id,
      status: 'pending',
      ...(type === 'medicine' ? { orderId: refId } : { consultationId: refId }),
    });

    return { orderId: order.id, amount, currency: 'INR', keyId };
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const expected  = crypto.createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');

    if (expected !== signature) throw new BadRequestException('Payment verification failed');

    await this.model.updateOne(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature: signature, status: 'success' }
    );
    return { success: true };
  }

  findAll()               { return this.model.find().sort({ createdAt: -1 }).lean(); }
  findByPatient(id:string){ return this.model.find({ patientId:id }).sort({ createdAt:-1 }).lean(); }
  async getRevenue() {
    const res = await this.model.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    return res;
  }
}
