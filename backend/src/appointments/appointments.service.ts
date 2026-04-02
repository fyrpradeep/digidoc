import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
@Injectable()
export class AppointmentsService {
  constructor(@InjectModel(Appointment.name) private model: Model<Appointment>) {}
  create(data:any)                  { return this.model.create(data); }
  findAll()                         { return this.model.find().sort({date:-1}).lean(); }
  findByPatient(id:string)          { return this.model.find({patientId:id}).sort({date:1}).lean(); }
  findByDoctor(id:string)           { return this.model.find({doctorId:id}).sort({date:1}).lean(); }
  findById(id:string)               { return this.model.findById(id).lean(); }
  update(id:string,data:any)        { return this.model.findByIdAndUpdate(id,data,{new:true}); }
  cancel(id:string,reason:string)   { return this.model.findByIdAndUpdate(id,{status:'cancelled',cancelReason:reason},{new:true}); }
  complete(id:string,prescId:string){ return this.model.findByIdAndUpdate(id,{status:'completed',prescriptionId:prescId},{new:true}); }
}
