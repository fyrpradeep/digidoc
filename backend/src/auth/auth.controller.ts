import { Controller, Post, Get, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // ── OTP ─────────────────────────────────────────────────────────
  @Post('send-otp')
  sendOtp(@Body() b: { mobile: string }) {
    return this.auth.sendOtp(b.mobile);
  }

  @Post('verify-otp')
  verifyOtp(@Body() b: { mobile: string; otp: string }) {
    return this.auth.verifyOtp(b.mobile, b.otp);
  }

  // ── REGISTER ────────────────────────────────────────────────────
  @Post('patient/register')
  registerPatient(@Body() b: { mobile: string; name: string; email?: string }) {
    return this.auth.registerPatient(b.mobile, b.name, b.email);
  }

  @Post('doctor/register')
  registerDoctor(@Body() b: { mobile: string; name: string; email?: string }) {
    return this.auth.registerDoctor(b.mobile, b.name, b.email);
  }

  // ── PASSWORD ────────────────────────────────────────────────────
  @Post('login')
  login(@Body() b: { identifier: string; password: string }) {
    return this.auth.loginWithPassword(b.identifier, b.password);
  }

  @Post('set-password')
  setPassword(@Body() b: { userId: string; role: string; password: string }) {
    return this.auth.setPassword(b.userId, b.role, b.password);
  }

  // ── ADMIN/STAFF/PHARMA ──────────────────────────────────────────
  @Post('admin/login')
  adminLogin(@Body() b: { email: string; password: string }) {
    return this.auth.adminLogin(b.email, b.password);
  }

  // ── GOOGLE OAUTH ────────────────────────────────────────────────
  @Get('google/patient')
  @UseGuards(AuthGuard('google-patient'))
  googlePatient() {}

  @Get('google/patient/callback')
  @UseGuards(AuthGuard('google-patient'))
  googlePatientCallback(@Req() req: any, @Res() res: any) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${req.user.token}&role=patient`);
  }

  @Get('google/doctor')
  @UseGuards(AuthGuard('google-doctor'))
  googleDoctor() {}

  @Get('google/doctor/callback')
  @UseGuards(AuthGuard('google-doctor'))
  googleDoctorCallback(@Req() req: any, @Res() res: any) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${req.user.token}&role=doctor`);
  }

  // ── STATS (for home page) ───────────────────────────────────────
  @Get('../stats')
  getStats() { return this.auth.getStats(); }
}
