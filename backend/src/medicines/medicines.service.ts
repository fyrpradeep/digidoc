import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicineEntity } from './medicine.entity';
@Injectable()
export class MedicinesService {
  constructor(@InjectRepository(MedicineEntity) private repo: Repository<MedicineEntity>) {}
  findAll(category?: string) {
    if (category && category !== 'All') return this.repo.find({ where: { category, isActive: true } });
    return this.repo.find({ where: { isActive: true } });
  }
  findOne(id: string)          { return this.repo.findOne({ where: { id } }); }
  create(data: Partial<MedicineEntity>) { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<MedicineEntity>) {
    await this.repo.update(id, data); return this.findOne(id);
  }
  async remove(id: string) { await this.repo.update(id, { isActive: false }); }
}
