import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtGuard }        from '../common/guards/jwt.guard';
import { CurrentUser }     from '../common/decorators/current-user.decorator';

@Controller('patients')
@UseGuards(JwtGuard)
export class PatientsController {
  constructor(private svc: PatientsService) {}

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.svc.findOne(user.sub);
  }

  @Put('me')
  updateMe(@CurrentUser() user: any, @Body() body: any) {
    return this.svc.update(user.sub, body);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
