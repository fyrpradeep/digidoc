import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from '../doctors/schemas/doctor.schema';
import { Patient } from '../patients/schemas/patient.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Order } from '../orders/schemas/order.schema';
@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Doctor.name)  private docModel:  Model<Doctor>,
    @InjectModel(Patient.name) private ptModel:   Model<Patient>,
    @InjectModel(Payment.name) private payModel:  Model<Payment>,
    @InjectModel(Order.name)   private ordModel:  Model<Order>,
  ) {}
  async getDashboardStats() {
    const [doctors,patients,totalRevenue,pendingOrders,onlineDrs] = await Promise.all([
      this.docModel.countDocuments({status:'approved'}),
      this.ptModel.countDocuments(),
      this.payModel.aggregate([{$match:{status:'success'}},{$group:{_id:null,total:{$sum:'$amount'}}}]),
      this.ordModel.countDocuments({status:'pending'}),
      this.docModel.countDocuments({status:'approved',isOnline:true}),
    ]);
    return { doctors, patients, totalRevenue:totalRevenue[0]?.total||0, pendingOrders, onlineDrs };
  }
  async getRevenueByMonth() {
    return this.payModel.aggregate([
      {$match:{status:'success'}},
      {$group:{_id:{month:{$month:'$createdAt'},year:{$year:'$createdAt'}},total:{$sum:'$amount'},count:{$sum:1}}},
      {$sort:{'_id.year':-1,'_id.month':-1}},{$limit:12},
    ]);
  }
  getTopDoctors() { return this.docModel.find({status:'approved'}).sort({totalConsults:-1}).limit(10).select('name specialty totalConsults totalEarnings rating').lean(); }
}
