import { Controller, Post, Body } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

@Controller('call')
export class CallController {

  @Post('agora-token')
  generateToken(@Body() b: { channelName: string; uid?: number }) {
    const appId   = process.env.AGORA_APP_ID;
    const appCert = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCert) {
      return { error: 'Agora not configured' };
    }

    const uid        = b.uid || 0;
    const expireTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCert,
      b.channelName,
      uid,
      RtcRole.PUBLISHER,
      expireTime
    );

    return { token, appId, channelName: b.channelName, uid };
  }
}
