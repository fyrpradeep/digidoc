import { IsString, IsNotEmpty, Matches } from 'class-validator';
export class SendOtpDto {
  @IsString() @IsNotEmpty()
  @Matches(/^(\+91)?[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' })
  mobile: string;
}
