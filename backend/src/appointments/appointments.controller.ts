import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtGuard }    from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@Controller('appointments')
@UseGuards(JwtGuard)
export class AppointmentsController {
  constructor(private svc: AppointmentsService) {}
  @Post()    create(@Body() b: any, @CurrentUser() u: any) { return this.svc.create({ ...b, patientId: u.sub }); }
  @Get('my') getMy(@CurrentUser() u: any) {
    if (u.role === 'doctor') return this.svc.findByDoctor(u.sub);
    return this.svc.findByPatient(u.sub);
  }
  @Get(':id')       getOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Put(':id/start') start(@Param('id') id: string) { return this.svc.start(id); }
  @Put(':id/end')   end(@Param('id') id: string)   { return this.svc.end(id); }
}
