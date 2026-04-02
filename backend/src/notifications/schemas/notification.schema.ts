import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true }) userId:    string;
  @Prop()                   role:      string;
  @Prop({ required: true }) title:     string;
  @Prop()                   body:      string;
  @Prop()                   type:      string;
  @Prop()                   link:      string;
  @Prop({ default: false }) isRead:    boolean;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
