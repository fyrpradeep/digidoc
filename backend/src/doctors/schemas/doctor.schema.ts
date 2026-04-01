import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true, index: true }) mobile: string;
  @Prop() specialty: string;
  @Prop() degree: string;
  @Prop() regNo: string;
  @Prop() experience: number;
  @Prop({ default: 299 }) fee: number;
  @Prop() rating: number;
  @Prop() photo: string;
  @Prop() bio: string;
  @Prop({ default: 'pending' }) status: string; // pending | approved | blocked
  @Prop({ default: false }) isOnline: boolean;
  @Prop({ default: 0 }) totalEarnings: number;
  @Prop({ default: 0 }) totalConsults: number;
  @Prop() bankAccount: string;
  @Prop() ifsc: string;
}
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
