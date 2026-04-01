import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtGuard }       from '../common/guards/jwt.guard';
import { CurrentUser }    from '../common/decorators/current-user.decorator';

@Controller('doctors')
export class DoctorsController {
  constructor(private svc: DoctorsService) {}

  @Get()
  getAll() { return this.svc.findAll(); }

  @Get('online')
  getOnline() { return this.svc.findOnline(); }

  @Get(':id')
  getOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Put('me/online')
  @UseGuards(JwtGuard)
  toggleOnline(@CurrentUser() user: any, @Body() body: { isOnline: boolean }) {
    return this.svc.toggleOnline(user.sub, body.isOnline);
  }

  @Put('me')
  @UseGuards(JwtGuard)
  updateMe(@CurrentUser() user: any, @Body() body: any) {
    return this.svc.update(user.sub, body);
  }
}
