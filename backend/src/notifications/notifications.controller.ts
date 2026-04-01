import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../common/guards/jwt.guard';
@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private svc: NotificationsService) {}
  @Post('sms') sendSms(@Body() b: { mobile: string; message: string }) {
    return this.svc.sendSms(b.mobile, b.message);
  }
}
