import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true }) doctorId:       string;
  @Prop({ required: true }) patientId:      string;
  @Prop()                   patientName:    string;
  @Prop({ required: true }) rating:         number;
  @Prop()                   review:         string;
  @Prop()                   consultationId: string;
  @Prop({ default: true })  isVisible:      boolean;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
