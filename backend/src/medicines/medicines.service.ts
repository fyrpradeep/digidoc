import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './schemas/medicine.schema';
@Injectable()
export class MedicinesService {
  constructor(@InjectModel(Medicine.name) private model: Model<Medicine>) {}
  findAll(q?:string,cat?:string)    { const f:any={isActive:true};if(cat)f.category=cat;if(q)f.name={$regex:q,$options:'i'};return this.model.find(f).lean(); }
  findById(id:string)               { return this.model.findById(id).lean(); }
  getCategories()                   { return this.model.distinct('category'); }
  create(data:any)                  { return this.model.create(data); }
  update(id:string,data:any)        { return this.model.findByIdAndUpdate(id,data,{new:true}); }
  updateStock(id:string,qty:number) { return this.model.findByIdAndUpdate(id,{$inc:{stock:qty}},{new:true}); }
  delete(id:string)                 { return this.model.findByIdAndUpdate(id,{isActive:false}); }
  getLowStock()                     { return this.model.find({isActive:true,$expr:{$lte:['$stock','$lowStockThreshold']}}).lean(); }
}
