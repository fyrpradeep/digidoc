import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
@Controller('medicines')
export class MedicinesController {
  constructor(private svc: MedicinesService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id') delete(@Param('id') id: string) { return this.svc.delete(id); }
}
