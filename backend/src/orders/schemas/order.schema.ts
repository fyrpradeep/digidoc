import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, index: true }) patientId:   string;
  @Prop()                                patientName: string;
  @Prop()                                patientMobile: string;
  @Prop({ type: Object })                address:     any;
  @Prop([{ medicineId: String, name: String, qty: Number, price: Number, total: Number }]) items: any[];
  @Prop()                                prescriptionId: string;
  @Prop()                                doctorReferralId: string;
  @Prop({ default: 0 })                  subtotal:    number;
  @Prop({ default: 50 })                 deliveryCharge: number;
  @Prop({ default: 0 })                  discount:    number;
  @Prop({ default: 0 })                  total:       number;
  @Prop({ default: 'pending' })          status:      string;
  @Prop()                                tracking:    string;
  @Prop()                                razorpayOrderId:   string;
  @Prop()                                razorpayPaymentId: string;
  @Prop()                                dispatchedAt: Date;
  @Prop()                                deliveredAt:  Date;
  @Prop()                                cancelReason: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
