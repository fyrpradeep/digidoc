import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MedicineEntity }      from './medicine.entity';
import { MedicinesController } from './medicines.controller';
import { MedicinesService }    from './medicines.service';
@Module({
  imports: [TypeOrmModule.forFeature([MedicineEntity]), JwtModule],
  controllers: [MedicinesController],
  providers:   [MedicinesService],
  exports:     [MedicinesService],
})
export class MedicinesModule {}
