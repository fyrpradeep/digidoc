import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Pharma extends Document {
  @Prop({ required: true })              name:      string;
  @Prop({ required: true, unique: true }) email:    string;
  @Prop({ required: true })              password:  string;
  @Prop({ default: true })               isActive:  boolean;
  @Prop()                                phone:     string;
  @Prop()                                address:   string;
  @Prop()                                createdBy: string;
}
export const PharmaSchema = SchemaFactory.createForClass(Pharma);
