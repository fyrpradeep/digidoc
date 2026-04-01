import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription } from './schemas/prescription.schema';
@Injectable()
export class PrescriptionsService {
  constructor(@InjectModel(Prescription.name) private model: Model<Prescription>) {}
  findByPatient(id: string) { return this.model.find({ patientId: id }).sort({ createdAt: -1 }).lean(); }
  create(data: any) { return this.model.create(data); }
}
