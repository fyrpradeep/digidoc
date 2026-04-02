import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Medicine extends Document {
  @Prop({ required: true })  name:                 string;
  @Prop()                    brand:                string;
  @Prop()                    category:             string;
  @Prop({ required: true })  price:                number;
  @Prop()                    mrp:                  number;
  @Prop({ default: 0 })      stock:                number;
  @Prop({ default: false })  requiresPrescription: boolean;
  @Prop()                    description:          string;
  @Prop()                    image:                string;
  @Prop()                    dosageForm:           string;
  @Prop()                    composition:          string;
  @Prop()                    manufacturer:         string;
  @Prop({ default: 0 })      discount:             number;
  @Prop({ default: true })   isActive:             boolean;
  @Prop({ default: 10 })     lowStockThreshold:    number;
}
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
