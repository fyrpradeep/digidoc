import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './schemas/coupon.schema';
@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private model: Model<Coupon>) {}
  create(data:any)        { return this.model.create(data); }
  findAll()               { return this.model.find().lean(); }
  toggle(id:string,v:boolean) { return this.model.findByIdAndUpdate(id,{isActive:v},{new:true}); }
  async validate(code:string,amount:number) {
    const c = await this.model.findOne({code:code.toUpperCase(),isActive:true});
    if (!c) throw new BadRequestException('Invalid coupon code');
    if (c.validTill && new Date()>c.validTill) throw new BadRequestException('Coupon expired');
    if (c.validFrom && new Date()<c.validFrom) throw new BadRequestException('Coupon not yet active');
    if (c.maxUses && c.usedCount>=c.maxUses) throw new BadRequestException('Coupon limit reached');
    if (c.minOrder && amount<c.minOrder) throw new BadRequestException(`Min order ₹${c.minOrder} required`);
    const discount = c.type==='percent' ? Math.min(amount*c.value/100, c.maxDiscount||Infinity) : c.value;
    return { valid:true, discount:Math.floor(discount), couponId:c._id, code:c.code };
  }
  use(id:string) { return this.model.updateOne({_id:id},{$inc:{usedCount:1}}); }
}
