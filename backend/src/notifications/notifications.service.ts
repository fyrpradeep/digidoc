import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationsService {
  constructor(private config: ConfigService) {}

  // ── TODO: MSG91 SMS ───────────────────────────────────────────────
  async sendSms(mobile: string, message: string) {
    // Uncomment when MSG91 key is ready:
    // await fetch('https://api.msg91.com/api/v2/sendsms', {
    //   method: 'POST',
    //   headers: { 'authkey': this.config.get('MSG91_API_KEY'), 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ sender: this.config.get('MSG91_SENDER'), route: '4', country: '91', sms: [{ message, to: [mobile] }] }),
    // });
    console.log(`📱 SMS to ${mobile}: ${message}`);
  }

  async sendOtpSms(mobile: string, otp: string) {
    return this.sendSms(mobile, `Your DigiDoc OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`);
  }

  async sendOrderUpdate(mobile: string, orderId: string, status: string) {
    return this.sendSms(mobile, `DigiDoc: Your order ${orderId} is now ${status}.`);
  }

  async sendAppointmentReminder(mobile: string, doctorName: string, time: string) {
    return this.sendSms(mobile, `DigiDoc: Reminder — Consultation with ${doctorName} at ${time}.`);
  }
}
