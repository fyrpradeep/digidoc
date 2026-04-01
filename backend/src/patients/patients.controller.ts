import { Controller, Get, Put, Body, Request } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtService } from '@nestjs/jwt';

@Controller('patients')
export class PatientsController {
  constructor(private svc: PatientsService, private jwt: JwtService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get('me')
  getMe(@Request() req: any) {
    try { const p = this.jwt.verify(req.headers?.authorization?.split(' ')[1]); return this.svc.findById(p.sub); } catch { return null; }
  }
}
