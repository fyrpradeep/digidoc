import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}
  @Get('dashboard')  getDashboard()  { return this.svc.getDashboardStats(); }
  @Get('revenue')    getRevenue()    { return this.svc.getRevenueByMonth(); }
  @Get('top-doctors') getTopDoctors(){ return this.svc.getTopDoctors(); }
}
