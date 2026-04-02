import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from '../doctors/schemas/doctor.schema';
import { Patient } from '../patients/schemas/patient.schema';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Doctor.name)  private docModel: Model<Doctor>,
    @InjectModel(Patient.name) private ptModel:  Model<Patient>,
  ) {}
  getPending()                              { return this.docModel.find({ status: 'pending' }).lean(); }
  getAllDoctors()                            { return this.docModel.find().select('-password').lean(); }
  getAllPatients()                           { return this.ptModel.find().select('-password').lean(); }
  approve(id: string)                       { return this.docModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true }); }
  reject(id: string, reason: string)        { return this.docModel.findByIdAndUpdate(id, { status: 'rejected', rejectionReason: reason }, { new: true }); }
  blockDoctor(id: string, status: string)   { return this.docModel.findByIdAndUpdate(id, { status, isOnline: false }, { new: true }); }
  blockPatient(id: string, status: string)  { return this.ptModel.findByIdAndUpdate(id, { status }, { new: true }); }
  setCommission(id: string, cc: number, mc: number) { return this.docModel.findByIdAndUpdate(id, { consultCommission: cc, medicineCommission: mc }, { new: true }); }
  async getStats() {
    const [doctors, patients, pending, onlineDrs] = await Promise.all([
      this.docModel.countDocuments({ status: 'approved' }),
      this.ptModel.countDocuments(),
      this.docModel.countDocuments({ status: 'pending' }),
      this.docModel.countDocuments({ status: 'approved', isOnline: true }),
    ]);
    return { doctors, patients, pending, onlineDrs };
  }
}
