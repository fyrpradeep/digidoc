import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private model: Model<Order>) {}
  findAll() { return this.model.find().sort({ createdAt: -1 }).lean(); }
  findByPatient(id: string) { return this.model.find({ patientId: id }).sort({ createdAt: -1 }).lean(); }
  create(data: any) { return this.model.create(data); }
  update(id: string, data: any) { return this.model.findByIdAndUpdate(id, data, { new: true }); }
}
