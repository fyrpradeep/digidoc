import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtService } from '@nestjs/jwt';
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private svc: PrescriptionsService, private jwt: JwtService) {}
  private uid(req:any) { try{return this.jwt.verify(req.headers?.authorization?.split(' ')[1],{secret:process.env.JWT_SECRET});}catch{return null;} }
  @Post()       create(@Body() b:any)                   { return this.svc.create(b); }
  @Get()        findAll()                               { return this.svc.findAll(); }
  @Get(':id')   findOne(@Param('id') id:string)         { return this.svc.findById(id); }
  @Get('my/list')
  findMy(@Request() req:any) { const p=this.uid(req);if(!p)return[];return this.svc.findByPatient(p.sub); }
  @Get('doctor/list')
  findDrMy(@Request() req:any) { const p=this.uid(req);if(!p)return[];return this.svc.findByDoctor(p.sub); }
}
