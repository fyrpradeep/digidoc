import { Controller, Get, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('patients')
export class PatientsController {
  constructor(private svc: PatientsService) {}
  @Get()           findAll()                                            { return this.svc.findAll(); }
  @Get(':id')      findOne(@Param('id') id: string)                    { return this.svc.findById(id); }
  @Put(':id')      update(@Param('id') id: string, @Body() b: any)    { return this.svc.update(id, b); }
}
