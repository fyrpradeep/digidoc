import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtService } from '@nestjs/jwt';
@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService, private jwt: JwtService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get('my')
  findMy(@Request() req: any) {
    try { const p=this.jwt.verify(req.headers?.authorization?.split(' ')[1]); return this.svc.findByPatient(p.sub); } catch { return []; }
  }
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
}
