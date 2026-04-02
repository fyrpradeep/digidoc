import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop()                     orderId:           string;
  @Prop()                     consultationId:    string;
  @Prop({ required: true })   patientId:         string;
  @Prop({ required: true })   amount:            number;
  @Prop()                     type:              string; // consultation | medicine
  @Prop()                     razorpayOrderId:   string;
  @Prop()                     razorpayPaymentId: string;
  @Prop()                     razorpaySignature:  string;
  @Prop({ default: 'pending' }) status:          string;
  @Prop()                     refundId:          string;
  @Prop()                     refundAmount:      number;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
