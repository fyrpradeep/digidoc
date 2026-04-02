import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private model: Model<Patient>) {}
  findAll()                          { return this.model.find().select('-password').lean(); }
  findById(id: string)               { return this.model.findById(id).select('-password').lean(); }
  findByMobile(mobile: string)       { return this.model.findOne({ mobile }).lean(); }
  update(id: string, data: any)      { return this.model.findByIdAndUpdate(id, data, { new: true }).select('-password'); }
  block(id: string, status: string)  { return this.model.findByIdAndUpdate(id, { status }, { new: true }); }
  count()                            { return this.model.countDocuments(); }
}
