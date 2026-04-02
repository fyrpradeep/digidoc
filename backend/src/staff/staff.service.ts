import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff } from './schemas/staff.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private model: Model<Staff>, private jwt: JwtService) {}
  async create(name:string,email:string,password:string,permissions:string[],createdBy:string) {
    const hashed = await bcrypt.hash(password, 12);
    return this.model.create({name,email,password:hashed,permissions,createdBy});
  }
  async login(email:string,password:string) {
    const s = await this.model.findOne({email,isActive:true});
    if (!s) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password,s.password);
    if (!valid) throw new UnauthorizedException('Wrong password');
    const token = this.jwt.sign({sub:s._id,role:'staff',permissions:s.permissions},{secret:process.env.JWT_SECRET,expiresIn:'7d'});
    await this.model.updateOne({_id:s._id},{lastLogin:new Date()});
    return {token,user:s,role:'staff'};
  }
  findAll()                    { return this.model.find().select('-password').lean(); }
  toggle(id:string,v:boolean)  { return this.model.findByIdAndUpdate(id,{isActive:v},{new:true}); }
  remove(id:string)            { return this.model.findByIdAndDelete(id); }
}
