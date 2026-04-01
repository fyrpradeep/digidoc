import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private model: Model<Patient>) {}
  findAll()   { return this.model.find().select('-__v').lean(); }
  findById(id: string) { return this.model.findById(id).lean(); }
  update(id: string, data: any) { return this.model.findByIdAndUpdate(id, data, { new: true }); }
}
