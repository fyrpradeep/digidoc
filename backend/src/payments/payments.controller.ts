import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtService } from '@nestjs/jwt';
@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService, private jwt: JwtService) {}
  private uid(req:any) { try{return this.jwt.verify(req.headers?.authorization?.split(' ')[1],{secret:process.env.JWT_SECRET});}catch{return null;} }
  @Post('create-order') createOrder(@Body() b:{amount:number;type:string;refId:string},@Request() r:any) {
    const p=this.uid(r); if(!p) return {error:'Unauthorized'};
    return this.svc.createRazorpayOrder(b.amount,b.type,p.sub,b.refId);
  }
  @Post('verify') verify(@Body() b:{razorpayOrderId:string;razorpayPaymentId:string;signature:string}) {
    return this.svc.verifyPayment(b.razorpayOrderId,b.razorpayPaymentId,b.signature);
  }
  @Get()        findAll()                              { return this.svc.findAll(); }
  @Get('my')    findMy(@Request() r:any)               { const p=this.uid(r);return p?this.svc.findByPatient(p.sub):[]; }
  @Get('revenue') getRevenue()                         { return this.svc.getRevenue(); }
}
