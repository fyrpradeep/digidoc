import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PharmaController } from './pharma.controller';
import { PharmaService } from './pharma.service';
import { Pharma, PharmaSchema } from './schemas/pharma.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Pharma.name,schema:PharmaSchema}]),JwtModule.register({secret:process.env.JWT_SECRET||'pmcare'})],
  controllers: [PharmaController], providers: [PharmaService], exports: [PharmaService],
})
export class PharmaModule {}
