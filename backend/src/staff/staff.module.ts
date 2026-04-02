import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Staff, StaffSchema } from './schemas/staff.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Staff.name,schema:StaffSchema}]),JwtModule.register({secret:process.env.JWT_SECRET||'pmcare'})],
  controllers: [StaffController], providers: [StaffService], exports: [StaffService],
})
export class StaffModule {}
