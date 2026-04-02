import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ required: true })          name:               string;
  @Prop({ index: true })             mobile:             string;
  @Prop({ index: true })             email:              string;
  @Prop()                            photo:              string;
  @Prop()                            googleId:           string;
  @Prop()                            password:           string;

  // Professional info
  @Prop()                            specialty:          string;
  @Prop()                            degree:             string;
  @Prop()                            regNo:              string;  // MCI number
  @Prop()                            experience:         number;
  @Prop()                            bio:                string;
  @Prop([String])                    languages:          string[];
  @Prop([String])                    awards:             string[];

  // Pricing
  @Prop({ default: 299 })            fee:                number;
  @Prop({ default: 499 })            specialistFee:      number;

  // Commission (set by admin)
  @Prop({ default: 80 })             consultCommission:  number; // Doctor gets 80%
  @Prop({ default: 5 })              medicineCommission: number; // Doctor gets 5% on referral

  // Status
  @Prop({ default: 'pending' })      status:             string; // pending|approved|blocked
  @Prop({ default: false })          isOnline:           boolean;
  @Prop()                            rejectionReason:    string;

  // Stats
  @Prop({ default: 4.5 })            rating:             number;
  @Prop({ default: 0 })              totalReviews:       number;
  @Prop({ default: 0 })              totalConsults:      number;
  @Prop({ default: 0 })              totalEarnings:      number;
  @Prop({ default: 0 })              pendingPayout:      number;

  // Bank for payout
  @Prop()                            bankAccount:        string;
  @Prop()                            ifsc:               string;
  @Prop()                            accountName:        string;
  @Prop()                            upi:                string;

  // Documents
  @Prop()                            degreeDoc:          string;
  @Prop()                            mciDoc:             string;

  // Availability
  @Prop({ default: true })           acceptingPatients:  boolean;
  @Prop()                            avgResponseTime:    number; // minutes

  // Admin notes
  @Prop()                            adminNotes:         string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
