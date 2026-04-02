import { Controller, Get, Put, Body, Param, Request } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtService } from '@nestjs/jwt';
@Controller('doctors')
export class DoctorsController {
  constructor(private svc: DoctorsService, private jwt: JwtService) {}
  private uid(req: any) { try { return this.jwt.verify(req.headers?.authorization?.split(' ')[1], { secret: process.env.JWT_SECRET }); } catch { return null; } }
  @Get()           findAll()                                             { return this.svc.findAll(); }
  @Get('online')   findOnline()                                          { return this.svc.findOnline(); }
  @Get(':id')      findOne(@Param('id') id: string)                     { return this.svc.findById(id); }
  @Put('me/online')
  setOnline(@Body() b: { isOnline: boolean }, @Request() req: any) {
    const p = this.uid(req); if (!p) return { error: 'Unauthorized' };
    return this.svc.setOnline(p.sub, b.isOnline);
  }
  @Put('me')
  updateMe(@Body() b: any, @Request() req: any) {
    const p = this.uid(req); if (!p) return { error: 'Unauthorized' };
    return this.svc.update(p.sub, b);
  }
}
