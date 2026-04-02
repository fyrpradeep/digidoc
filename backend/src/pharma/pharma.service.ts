import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pharma } from './schemas/pharma.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class PharmaService {
  constructor(@InjectModel(Pharma.name) private model: Model<Pharma>, private jwt: JwtService) {}
  async create(name:string,email:string,password:string,phone:string,address:string,createdBy:string) {
    const hashed = await bcrypt.hash(password,12);
    return this.model.create({name,email,password:hashed,phone,address,createdBy});
  }
  async login(email:string,password:string) {
    const p = await this.model.findOne({email,isActive:true});
    if (!p) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password,p.password);
    if (!valid) throw new UnauthorizedException('Wrong password');
    const token = this.jwt.sign({sub:p._id,role:'pharma'},{secret:process.env.JWT_SECRET,expiresIn:'7d'});
    return {token,user:p,role:'pharma'};
  }
  findAll()   { return this.model.find().select('-password').lean(); }
  toggle(id:string,v:boolean) { return this.model.findByIdAndUpdate(id,{isActive:v},{new:true}); }
}
