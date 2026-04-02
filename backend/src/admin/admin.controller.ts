import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
@Controller('admin')
export class AdminController {
  constructor(private svc: AdminService) {}
  @Get('stats')                   getStats()                                                           { return this.svc.getStats(); }
  @Get('doctors/pending')         getPending()                                                         { return this.svc.getPending(); }
  @Get('doctors')                 getDoctors()                                                         { return this.svc.getAllDoctors(); }
  @Get('patients')                getPatients()                                                        { return this.svc.getAllPatients(); }
  @Post('doctors/:id/approve')    approve(@Param('id') id: string)                                    { return this.svc.approve(id); }
  @Post('doctors/:id/reject')     reject(@Param('id') id: string, @Body() b: { reason: string })      { return this.svc.reject(id, b.reason); }
  @Put('doctors/:id/block')       blockDoc(@Param('id') id: string, @Body() b: { status: string })    { return this.svc.blockDoctor(id, b.status); }
  @Put('patients/:id/block')      blockPt(@Param('id') id: string, @Body() b: { status: string })     { return this.svc.blockPatient(id, b.status); }
  @Put('doctors/:id/commission')  setComm(@Param('id') id: string, @Body() b: { consultCommission: number; medicineCommission: number }) { return this.svc.setCommission(id, b.consultCommission, b.medicineCommission); }
}
