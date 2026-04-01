import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard }     from '../common/guards/jwt.guard';
@Controller('admin')
@UseGuards(JwtGuard)
export class AdminController {
  constructor(private svc: AdminService) {}
  @Get('stats')                  getStats()                  { return this.svc.getDashboardStats(); }
  @Get('doctors/pending')        getPending()                { return this.svc.getPendingDoctors(); }
  @Put('doctors/:id/approve')    approve(@Param('id') id: string) { return this.svc.approveDoctor(id); }
  @Put('doctors/:id/reject')     reject(@Param('id') id: string)  { return this.svc.rejectDoctor(id); }
  @Put('doctors/:id/suspend')    suspend(@Param('id') id: string) { return this.svc.suspendDoctor(id); }
  @Get('patients')               getPatients()               { return this.svc.getAllPatients(); }
  @Get('orders')                 getOrders()                 { return this.svc.getAllOrders(); }
  @Put('orders/:id/dispatch')    dispatch(@Param('id') id: string, @Body() b: { trackingNo: string }) {
    return this.svc.dispatchOrder(id, b.trackingNo);
  }
  @Post('medicines')             addMed(@Body() b: any)         { return this.svc.addMedicine(b); }
  @Put('medicines/:id')          updateMed(@Param('id') id: string, @Body() b: any) { return this.svc.updateMedicine(id, b); }
  @Delete('medicines/:id')       removeMed(@Param('id') id: string) { return this.svc.removeMedicine(id); }
}
