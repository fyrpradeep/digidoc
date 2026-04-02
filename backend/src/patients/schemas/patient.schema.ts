import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Patient extends Document {
  // Basic info
  @Prop({ required: true })                  name:         string;
  @Prop({ index: true })                     mobile:       string;
  @Prop({ index: true })                     email:        string;
  @Prop()                                    photo:        string;
  @Prop()                                    age:          number;
  @Prop()                                    gender:       string;
  @Prop()                                    bloodGroup:   string;
  @Prop()                                    city:         string;

  // Google OAuth
  @Prop({ index: true })                     googleId:     string;

  // Password (hashed)
  @Prop()                                    password:     string;

  // Delivery addresses
  @Prop([{
    label:   String,
    line1:   String,
    line2:   String,
    city:    String,
    state:   String,
    pincode: String,
    isDefault: Boolean,
  }])
  addresses: any[];

  // Medical info
  @Prop([String])                            allergies:   string[];
  @Prop([String])                            conditions:  string[];
  @Prop()                                    emergencyContact: string;
  @Prop()                                    emergencyName:    string;

  // Family members
  @Prop([{
    name:      String,
    relation:  String,
    age:       Number,
    gender:    String,
    bloodGroup:String,
  }])
  family: any[];

  // Settings
  @Prop({ default: 'en' })                   language:    string;
  @Prop({ default: 'active' })               status:      string;  // active | blocked
  @Prop({ default: 0 })                      totalConsults: number;

  // Notifications
  @Prop({ default: true })                   notifAppointment: boolean;
  @Prop({ default: true })                   notifOrder:       boolean;
  @Prop({ default: true })                   notifOffers:      boolean;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
