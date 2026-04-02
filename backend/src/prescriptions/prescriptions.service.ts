import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription } from './schemas/prescription.schema';
@Injectable()
export class PrescriptionsService {
  constructor(@InjectModel(Prescription.name) private model: Model<Prescription>) {}
  create(data:any)             { return this.model.create(data); }
  findByPatient(id:string)     { return this.model.find({patientId:id}).sort({createdAt:-1}).lean(); }
  findByDoctor(id:string)      { return this.model.find({doctorId:id}).sort({createdAt:-1}).lean(); }
  findById(id:string)          { return this.model.findById(id).lean(); }
  findAll()                    { return this.model.find().sort({createdAt:-1}).lean(); }
}
