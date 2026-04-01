import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtGuard }    from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@Controller('prescriptions')
@UseGuards(JwtGuard)
export class PrescriptionsController {
  constructor(private svc: PrescriptionsService) {}
  @Post()   create(@Body() b: any)     { return this.svc.create(b); }
  @Get('my') getMyRx(@CurrentUser() u: any) {
    if (u.role === 'doctor') return this.svc.findByDoctor(u.sub);
    return this.svc.findByPatient(u.sub);
  }
  @Get(':id') getOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
