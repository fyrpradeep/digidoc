import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StaffService } from './staff.service';
@Controller('staff')
export class StaffController {
  constructor(private svc: StaffService) {}
  @Post('login')  login(@Body() b:{email:string;password:string}) { return this.svc.login(b.email,b.password); }
  @Get()          findAll()                                        { return this.svc.findAll(); }
  @Post()         create(@Body() b:any)                            { return this.svc.create(b.name,b.email,b.password,b.permissions,b.createdBy); }
  @Put(':id/toggle') toggle(@Param('id') id:string,@Body() b:{isActive:boolean}) { return this.svc.toggle(id,b.isActive); }
  @Delete(':id')  remove(@Param('id') id:string)                  { return this.svc.remove(id); }
}
