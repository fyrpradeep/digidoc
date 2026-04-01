import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService }    from './auth.service';
import { SendOtpDto }     from './dto/send-otp.dto';
import { VerifyOtpDto }   from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/auth/send-otp
  @Post('send-otp')
  @HttpCode(200)
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.mobile);
  }

  // POST /api/auth/verify-otp
  @Post('verify-otp')
  @HttpCode(200)
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.mobile, dto.otp);
  }

  // POST /api/auth/complete-registration
  @Post('complete-registration')
  @HttpCode(200)
  completeRegistration(@Body() body: { mobile: string; role: 'patient' | 'doctor'; name?: string }) {
    return this.authService.completeRegistration(body.mobile, body.role, body.name);
  }

  // POST /api/auth/admin-login
  @Post('admin-login')
  @HttpCode(200)
  adminLogin(@Body() body: { username: string; password: string }) {
    return this.authService.adminLogin(body.username, body.password);
  }
}
