import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private model: Model<Doctor>) {}
  findAll(filter?: any)             { return this.model.find({ status: 'approved', ...filter }).select('-password -adminNotes').lean(); }
  findOnline()                      { return this.model.find({ status: 'approved', isOnline: true }).select('-password').lean(); }
  findById(id: string)              { return this.model.findById(id).select('-password').lean(); }
  findPending()                     { return this.model.find({ status: 'pending' }).lean(); }
  findAll_admin()                   { return this.model.find().select('-password').lean(); }
  update(id: string, data: any)     { return this.model.findByIdAndUpdate(id, data, { new: true }).select('-password'); }
  setOnline(id: string, v: boolean) { return this.model.findByIdAndUpdate(id, { isOnline: v }, { new: true }); }
  approve(id: string)               { return this.model.findByIdAndUpdate(id, { status: 'approved' }, { new: true }); }
  reject(id: string, reason: string){ return this.model.findByIdAndUpdate(id, { status: 'rejected', rejectionReason: reason }, { new: true }); }
  block(id: string, status: string) { return this.model.findByIdAndUpdate(id, { status, isOnline: false }, { new: true }); }
  setCommission(id: string, cc: number, mc: number) { return this.model.findByIdAndUpdate(id, { consultCommission: cc, medicineCommission: mc }, { new: true }); }
  count()                           { return this.model.countDocuments({ status: 'approved' }); }
  async addEarnings(id: string, amount: number) {
    return this.model.findByIdAndUpdate(id, { $inc: { totalEarnings: amount, pendingPayout: amount, totalConsults: 1 } }, { new: true });
  }
}
