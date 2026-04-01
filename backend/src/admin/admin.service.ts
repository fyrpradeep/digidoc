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

  getPendingDoctors() { return this.docModel.find({ status: 'pending' }).lean(); }
  approveDoctor(id: string) { return this.docModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true }); }
  rejectDoctor(id: string)  { return this.docModel.findByIdAndDelete(id); }
  blockDoctor(id: string, status: string)   { return this.docModel.findByIdAndUpdate(id, { status }, { new: true }); }
  blockPatient(id: string, status: string)  { return this.ptModel.findByIdAndUpdate(id, { status }, { new: true }); }
  getAllDoctors()   { return this.docModel.find().lean(); }
  getAllPatients()  { return this.ptModel.find().lean(); }

  async getStats() {
    const [doctors, patients, pendingDrs] = await Promise.all([
      this.docModel.countDocuments({ status: 'approved' }),
      this.ptModel.countDocuments(),
      this.docModel.countDocuments({ status: 'pending' }),
    ]);
    return { doctors, patients, pendingDrs };
  }
}
