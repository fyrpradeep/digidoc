import { Controller, Post, Body } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
@Controller('call')
export class CallController {
  @Post('agora-token')
  generateToken(@Body() b: { channelName: string; uid?: number }) {
    const appId = process.env.AGORA_APP_ID;
    const cert  = process.env.AGORA_APP_CERTIFICATE;
    if (!appId || !cert) return { error: 'Agora not configured' };
    const expire = Math.floor(Date.now()/1000) + 3600;
    const token  = RtcTokenBuilder.buildTokenWithUid(appId, cert, b.channelName, b.uid||0, RtcRole.PUBLISHER, expire);
    return { token, appId, channelName: b.channelName, uid: b.uid||0 };
  }
}
