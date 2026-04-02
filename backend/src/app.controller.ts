import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './doctors/schemas/doctor.schema';
import { Patient } from './patients/schemas/patient.schema';
@Controller()
export class AppController {
  constructor(
    @InjectModel(Doctor.name)  private docModel: Model<Doctor>,
    @InjectModel(Patient.name) private ptModel:  Model<Patient>,
  ) {}
  @Get('stats')
  async getStats() {
    const [doctors,patients] = await Promise.all([
      this.docModel.countDocuments({status:'approved'}),
      this.ptModel.countDocuments(),
    ]);
    return {doctors,patients};
  }
}
