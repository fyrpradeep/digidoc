import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtService } from '@nestjs/jwt';
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private svc: PrescriptionsService, private jwt: JwtService) {}
  @Get('my')
  findMy(@Request() req: any) {
    try { const p=this.jwt.verify(req.headers?.authorization?.split(' ')[1]); return this.svc.findByPatient(p.sub); } catch { return []; }
  }
  @Post() create(@Body() b: any) { return this.svc.create(b); }
}
