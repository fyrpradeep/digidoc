import { Controller, Get, Post, Put, Body, Param, Query, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtService } from '@nestjs/jwt';
@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService, private jwt: JwtService) {}
  private uid(req:any) { try{return this.jwt.verify(req.headers?.authorization?.split(' ')[1],{secret:process.env.JWT_SECRET});}catch{return null;} }
  @Post()         create(@Body() b:any)                          { return this.svc.create(b); }
  @Get()          findAll(@Query('status') s:string)             { return this.svc.findAll(s); }
  @Get('my')      findMy(@Request() r:any)                       { const p=this.uid(r);return p?this.svc.findByPatient(p.sub):[]; }
  @Get(':id')     findOne(@Param('id') id:string)                { return this.svc.findById(id); }
  @Put(':id')     update(@Param('id') id:string,@Body() b:any)   { return this.svc.update(id,b); }
  @Put(':id/dispatch') dispatch(@Param('id') id:string,@Body() b:{tracking:string}) { return this.svc.dispatch(id,b.tracking); }
  @Put(':id/deliver')  deliver(@Param('id') id:string)           { return this.svc.deliver(id); }
  @Put(':id/cancel')   cancel(@Param('id') id:string,@Body() b:{reason:string}) { return this.svc.cancel(id,b.reason); }
  @Put(':id/address')  updateAddr(@Param('id') id:string,@Body() b:any) { return this.svc.updateAddress(id,b.address); }
}
