import { Controller, Get, Put, Body, Param, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtService } from '@nestjs/jwt';
@Controller('notifications')
export class NotificationsController {
  constructor(private svc: NotificationsService, private jwt: JwtService) {}
  private uid(req:any) { try{return this.jwt.verify(req.headers?.authorization?.split(' ')[1],{secret:process.env.JWT_SECRET});}catch{return null;} }
  @Get()           findAll(@Request() r:any)              { const p=this.uid(r);return p?this.svc.findByUser(p.sub):[]; }
  @Get('unread')   unread(@Request() r:any)               { const p=this.uid(r);return p?this.svc.unreadCount(p.sub):0; }
  @Put(':id/read') markRead(@Param('id') id:string)       { return this.svc.markRead(id); }
  @Put('read-all') markAll(@Request() r:any)              { const p=this.uid(r);return p?this.svc.markAllRead(p.sub):null; }
}
