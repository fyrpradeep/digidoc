import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './schemas/medicine.schema';
@Injectable()
export class MedicinesService {
  constructor(@InjectModel(Medicine.name) private model: Model<Medicine>) {}
  findAll() { return this.model.find().lean(); }
  create(data: any) { return this.model.create(data); }
  update(id: string, data: any) { return this.model.findByIdAndUpdate(id, data, { new: true }); }
  delete(id: string) { return this.model.findByIdAndDelete(id); }
}
