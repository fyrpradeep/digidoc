import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { PatientEntity }    from './patient.entity';

@Injectable()
export class PatientsService {
  constructor(@InjectRepository(PatientEntity) private repo: Repository<PatientEntity>) {}

  findAll()               { return this.repo.find({ where: { isActive: true } }); }
  findOne(id: string)     { return this.repo.findOne({ where: { id } }); }
  findByMobile(m: string) { return this.repo.findOne({ where: { mobile: m } }); }

  async update(id: string, data: Partial<PatientEntity>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.update(id, { isActive: false });
    return { message: 'Account deactivated' };
  }
}
