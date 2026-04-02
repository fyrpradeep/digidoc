import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
@Controller('coupons')
export class CouponsController {
  constructor(private svc: CouponsService) {}
  @Post()              create(@Body() b:any)                                      { return this.svc.create(b); }
  @Get()               findAll()                                                  { return this.svc.findAll(); }
  @Post('validate')    validate(@Body() b:{code:string;amount:number})            { return this.svc.validate(b.code,b.amount); }
  @Put(':id/toggle')   toggle(@Param('id') id:string,@Body() b:{isActive:boolean}) { return this.svc.toggle(id,b.isActive); }
}
