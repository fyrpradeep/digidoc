import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ required: true })       name:        string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true })       password:    string;
  @Prop({ default: true })        isActive:    boolean;
  @Prop([String])                 permissions: string[];
  @Prop()                         createdBy:   string;
  @Prop()                         lastLogin:   Date;
}
export const StaffSchema = SchemaFactory.createForClass(Staff);
