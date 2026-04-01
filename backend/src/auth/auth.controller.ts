import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('send-otp')
  sendOtp(@Body() b: { mobile: string }) { return this.auth.sendOtp(b.mobile); }

  @Post('verify-otp')
  verifyOtp(@Body() b: { mobile: string; otp: string }) { return this.auth.verifyOtp(b.mobile, b.otp); }

  @Post('complete-registration')
  register(@Body() b: { mobile: string; role: 'patient'|'doctor'; name: string }) {
    return this.auth.completeRegistration(b.mobile, b.role, b.name);
  }

  @Post('admin-login')
  adminLogin(@Body() b: { email: string; password: string }) { return this.auth.adminLogin(b.email, b.password); }
}
