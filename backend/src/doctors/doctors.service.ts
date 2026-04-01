import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { DoctorEntity }     from './doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(@InjectRepository(DoctorEntity) private repo: Repository<DoctorEntity>) {}

  findAll()                    { return this.repo.find({ where: { status: 'approved', isActive: true } }); }
  findOnline()                 { return this.repo.find({ where: { status: 'approved', isOnline: true } }); }
  findPending()                { return this.repo.find({ where: { status: 'pending' } }); }
  findOne(id: string)          { return this.repo.findOne({ where: { id } }); }
  findByMobile(m: string)      { return this.repo.findOne({ where: { mobile: m } }); }

  async toggleOnline(id: string, isOnline: boolean) {
    await this.repo.update(id, { isOnline });
    return this.findOne(id);
  }

  async update(id: string, data: Partial<DoctorEntity>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async approve(id: string)  { return this.update(id, { status: 'approved' }); }
  async reject(id: string)   { return this.update(id, { status: 'rejected' }); }
  async suspend(id: string)  { return this.update(id, { status: 'suspended' }); }
}
