import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
@Controller('medicines')
export class MedicinesController {
  constructor(private svc: MedicinesService) {}
  @Get()           findAll(@Query('q') q:string,@Query('cat') cat:string) { return this.svc.findAll(q,cat); }
  @Get('categories') getCategories()                                      { return this.svc.getCategories(); }
  @Get('low-stock')  getLow()                                             { return this.svc.getLowStock(); }
  @Get(':id')      findOne(@Param('id') id:string)                        { return this.svc.findById(id); }
  @Post()          create(@Body() b:any)                                  { return this.svc.create(b); }
  @Put(':id')      update(@Param('id') id:string,@Body() b:any)           { return this.svc.update(id,b); }
  @Put(':id/stock') updateStock(@Param('id') id:string,@Body() b:{qty:number}) { return this.svc.updateStock(id,b.qty); }
  @Delete(':id')   remove(@Param('id') id:string)                        { return this.svc.delete(id); }
}
