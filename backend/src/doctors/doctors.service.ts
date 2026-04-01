import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private model: Model<Doctor>) {}
  findAll()            { return this.model.find({ status: 'approved' }).select('-__v').lean(); }
  findOnline()         { return this.model.find({ status: 'approved', isOnline: true }).select('-__v').lean(); }
  findById(id: string) { return this.model.findById(id).lean(); }
  setOnline(id: string, isOnline: boolean) { return this.model.findByIdAndUpdate(id, { isOnline }, { new: true }); }
  update(id: string, data: any) { return this.model.findByIdAndUpdate(id, data, { new: true }); }
}
