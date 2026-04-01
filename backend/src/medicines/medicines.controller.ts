import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { JwtGuard } from '../common/guards/jwt.guard';
@Controller('medicines')
export class MedicinesController {
  constructor(private svc: MedicinesService) {}
  @Get()    getAll(@Query('category') cat: string) { return this.svc.findAll(cat); }
  @Get(':id') getOne(@Param('id') id: string)      { return this.svc.findOne(id); }
  @Post()    @UseGuards(JwtGuard) create(@Body() b: any) { return this.svc.create(b); }
  @Put(':id') @UseGuards(JwtGuard) update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id') @UseGuards(JwtGuard) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
