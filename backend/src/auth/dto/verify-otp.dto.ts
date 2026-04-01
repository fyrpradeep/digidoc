import { IsString, IsNotEmpty, Length } from 'class-validator';
export class VerifyOtpDto {
  @IsString() @IsNotEmpty() mobile: string;
  @IsString() @Length(6, 6, { message: 'OTP must be exactly 6 digits' }) otp: string;
}
