import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { PharmaService } from './pharma.service';
@Controller('pharma')
export class PharmaController {
  constructor(private svc: PharmaService) {}
  @Post('login')  login(@Body() b:{email:string;password:string}) { return this.svc.login(b.email,b.password); }
  @Get()          findAll()                                        { return this.svc.findAll(); }
  @Post()         create(@Body() b:any)                            { return this.svc.create(b.name,b.email,b.password,b.phone,b.address,b.createdBy); }
  @Put(':id/toggle') toggle(@Param('id') id:string,@Body() b:{isActive:boolean}) { return this.svc.toggle(id,b.isActive); }
}
