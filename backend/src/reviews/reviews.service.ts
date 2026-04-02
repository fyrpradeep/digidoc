import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { Doctor } from '../doctors/schemas/doctor.schema';
@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private model: Model<Review>, @InjectModel(Doctor.name) private docModel: Model<Doctor>) {}
  async create(data:any) {
    const r = await this.model.create(data);
    // Update doctor avg rating
    const reviews = await this.model.find({doctorId:data.doctorId,isVisible:true});
    const avg = reviews.reduce((a,b)=>a+b.rating,0)/reviews.length;
    await this.docModel.updateOne({_id:data.doctorId},{rating:Math.round(avg*10)/10,totalReviews:reviews.length});
    return r;
  }
  findByDoctor(id:string) { return this.model.find({doctorId:id,isVisible:true}).sort({createdAt:-1}).lean(); }
  findAll()               { return this.model.find().sort({createdAt:-1}).lean(); }
}
