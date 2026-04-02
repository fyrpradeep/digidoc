import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({ required: true, unique: true }) code:       string;
  @Prop()                                 description: string;
  @Prop()                                 type:        string; // percent | flat
  @Prop({ required: true })               value:       number;
  @Prop()                                 minOrder:    number;
  @Prop()                                 maxDiscount: number;
  @Prop()                                 validFrom:   Date;
  @Prop()                                 validTill:   Date;
  @Prop({ default: 0 })                   usedCount:   number;
  @Prop()                                 maxUses:     number;
  @Prop({ default: true })                isActive:    boolean;
  @Prop()                                 createdBy:   string;
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);
