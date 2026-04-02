import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ required: true }) patientId:   string;
  @Prop()                   patientName: string;
  @Prop({ required: true }) doctorId:    string;
  @Prop()                   doctorName:  string;
  @Prop({ required: true }) date:        string;
  @Prop({ required: true }) time:        string;
  @Prop()                   type:        string; // video | audio | chat
  @Prop()                   fee:         number;
  @Prop({ default: 'booked' }) status:  string; // booked | confirmed | completed | cancelled | no-show
  @Prop()                   notes:       string;
  @Prop()                   paymentId:   string;
  @Prop()                   prescriptionId: string;
  @Prop()                   cancelReason: string;
  @Prop()                   roomId:      string;
}
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
