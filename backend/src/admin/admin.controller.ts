import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private svc: AdminService) {}
  @Get('stats')           getStats()    { return this.svc.getStats(); }
  @Get('pending-doctors') getPending()  { return this.svc.getPendingDoctors(); }
  @Get('doctors')         getDoctors()  { return this.svc.getAllDoctors(); }
  @Get('patients')        getPatients() { return this.svc.getAllPatients(); }
  @Post('approve-doctor/:id') approve(@Param('id') id: string) { return this.svc.approveDoctor(id); }
  @Post('reject-doctor/:id')  reject(@Param('id') id: string)  { return this.svc.rejectDoctor(id); }
  @Post('block-doctor/:id')   blockDoc(@Param('id') id: string, @Body() b: {status:string}) { return this.svc.blockDoctor(id, b.status); }
  @Post('block-patient/:id')  blockPt(@Param('id') id: string, @Body() b: {status:string})  { return this.svc.blockPatient(id, b.status); }
}
