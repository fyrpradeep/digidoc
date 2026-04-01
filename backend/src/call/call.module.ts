import { Module } from '@nestjs/common';
import { CallGateway } from './call.gateway';
import { CallController } from './call.controller';

@Module({
  providers: [CallGateway],
  controllers: [CallController],
  exports: [CallGateway],
})
export class CallModule {}
