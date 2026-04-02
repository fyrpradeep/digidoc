import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ required: true, index: true }) mobile:    string;
  @Prop({ required: true })              otp:       string;
  @Prop({ required: true })              expiresAt: Date;
  @Prop({ default: 0 })                  attempts:  number;
}
export const OtpSchema = SchemaFactory.createForClass(Otp);
