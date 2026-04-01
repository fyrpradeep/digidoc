import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard }    from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private svc: OrdersService) {}
  @Post()   create(@Body() b: any, @CurrentUser() u: any) { return this.svc.create({ ...b, patientId: u.sub }); }
  @Get('my') getMy(@CurrentUser() u: any)   { return this.svc.findByPatient(u.sub); }
  @Get('all') getAll()                      { return this.svc.findAll(); }
  @Get('pending') getPending()              { return this.svc.findPending(); }
  @Get(':id') getOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Put(':id/dispatch') dispatch(@Param('id') id: string, @Body() b: { trackingNo: string }) {
    return this.svc.dispatch(id, b.trackingNo);
  }
  @Put(':id/deliver') deliver(@Param('id') id: string) { return this.svc.deliver(id); }
}
