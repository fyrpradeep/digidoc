import { Controller, Get, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtService } from '@nestjs/jwt';

@Controller('doctors')
export class DoctorsController {
  constructor(private svc: DoctorsService, private jwt: JwtService) {}

  @Get() findAll() { return this.svc.findAll(); }
  @Get('online') findOnline() { return this.svc.findOnline(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Put('me/online')
  setOnline(@Body() b: { isOnline: boolean }, @Request() req: any) {
    try {
      const token = req.headers?.authorization?.split(' ')[1];
      const p = this.jwt.verify(token);
      return this.svc.setOnline(p.sub, b.isOnline);
    } catch { return { ok: false }; }
  }
}
