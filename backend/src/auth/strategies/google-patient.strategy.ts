import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GooglePatientStrategy extends PassportStrategy(Strategy, 'google-patient') {
  constructor(private auth: AuthService) {
    super({
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.FRONTEND_URL?.replace('www.','api.')}/api/auth/google/patient/callback`,
      scope: ['email', 'profile'],
    });
  }
  async validate(_at: string, _rt: string, profile: any) {
    const user = await this.auth.googleLogin({
      googleId: profile.id,
      email:    profile.emails?.[0]?.value,
      name:     profile.displayName,
      photo:    profile.photos?.[0]?.value,
    }, 'patient');
    return user;
  }
}
