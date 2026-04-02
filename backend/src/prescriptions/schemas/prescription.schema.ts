import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Prescription extends Document {
  @Prop({ required: true, index: true }) patientId:   string;
  @Prop()                                patientName: string;
  @Prop({ required: true })              doctorId:    string;
  @Prop()                                doctorName:  string;
  @Prop()                                consultationId: string;
  @Prop()                                diagnosis:   string;
  @Prop([{ name: String, dosage: String, duration: String, timing: String }]) medicines: any[];
  @Prop()                                advice:      string;
  @Prop()                                followUpDate: Date;
  @Prop({ default: true })               isValid:     boolean;
}
export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
