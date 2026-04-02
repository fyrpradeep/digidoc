import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtService } from '@nestjs/jwt';
@Controller('appointments')
export class AppointmentsController {
  constructor(private svc: AppointmentsService, private jwt: JwtService) {}
  private uid(req:any) { try{return this.jwt.verify(req.headers?.authorization?.split(' ')[1],{secret:process.env.JWT_SECRET});}catch{return null;} }
  @Post()        create(@Body() b:any)                                   { return this.svc.create(b); }
  @Get()         findAll()                                               { return this.svc.findAll(); }
  @Get('my')     findMy(@Request() r:any)                                { const p=this.uid(r);return p?this.svc.findByPatient(p.sub):[]; }
  @Get('doctor') findDr(@Request() r:any)                                { const p=this.uid(r);return p?this.svc.findByDoctor(p.sub):[]; }
  @Get(':id')    findOne(@Param('id') id:string)                         { return this.svc.findById(id); }
  @Put(':id')    update(@Param('id') id:string,@Body() b:any)            { return this.svc.update(id,b); }
  @Put(':id/cancel') cancel(@Param('id') id:string,@Body() b:{reason:string}) { return this.svc.cancel(id,b.reason); }
}
