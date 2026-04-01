import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Patient extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true, index: true }) mobile: string;
  @Prop() email: string;
  @Prop() age: number;
  @Prop() gender: string;
  @Prop() city: string;
  @Prop({ default: 'active' }) status: string; // active | blocked
  @Prop({ default: 0 }) totalConsults: number;
}
export const PatientSchema = SchemaFactory.createForClass(Patient);
