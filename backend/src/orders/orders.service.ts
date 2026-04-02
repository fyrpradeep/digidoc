import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private model: Model<Order>) {}
  create(data:any)                     { return this.model.create(data); }
  findAll(status?:string)              { const f:any={};if(status)f.status=status;return this.model.find(f).sort({createdAt:-1}).lean(); }
  findByPatient(id:string)             { return this.model.find({patientId:id}).sort({createdAt:-1}).lean(); }
  findById(id:string)                  { return this.model.findById(id).lean(); }
  update(id:string,data:any)           { return this.model.findByIdAndUpdate(id,data,{new:true}); }
  dispatch(id:string,tracking:string)  { return this.model.findByIdAndUpdate(id,{status:'dispatched',tracking,dispatchedAt:new Date()},{new:true}); }
  deliver(id:string)                   { return this.model.findByIdAndUpdate(id,{status:'delivered',deliveredAt:new Date()},{new:true}); }
  cancel(id:string,reason:string)      { return this.model.findByIdAndUpdate(id,{status:'cancelled',cancelReason:reason},{new:true}); }
  updateAddress(id:string,address:any) { return this.model.findByIdAndUpdate(id,{address},{new:true}); }
  countByStatus()                      { return this.model.aggregate([{$group:{_id:'$status',count:{$sum:1}}}]); }
}
