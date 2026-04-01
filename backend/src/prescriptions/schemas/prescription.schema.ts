import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Prescription extends Document {
  @Prop({ required: true }) patientId: string;
  @Prop() patientName: string;
  @Prop() doctorId: string;
  @Prop() doctorName: string;
  @Prop() diagnosis: string;
  @Prop([String]) medicines: string[];
  @Prop() advice: string;
  @Prop() appointmentId: string;
}
export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
