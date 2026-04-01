import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop() patientId: string;
  @Prop() patientName: string;
  @Prop() patientMobile: string;
  @Prop([{name:String,qty:Number,price:Number}]) items: any[];
  @Prop() total: number;
  @Prop() address: string;
  @Prop({ default: 'pending' }) status: string;
  @Prop() tracking: string;
  @Prop() prescriptionId: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
