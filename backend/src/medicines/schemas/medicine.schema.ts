import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Medicine extends Document {
  @Prop({ required: true }) name: string;
  @Prop() brand: string;
  @Prop() category: string;
  @Prop() price: number;
  @Prop() mrp: number;
  @Prop({ default: 0 }) stock: number;
  @Prop({ default: false }) requiresPrescription: boolean;
  @Prop() description: string;
}
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
