import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrescriptionEntity } from './prescription.entity';
@Injectable()
export class PrescriptionsService {
  constructor(@InjectRepository(PrescriptionEntity) private repo: Repository<PrescriptionEntity>) {}
  create(data: Partial<PrescriptionEntity>) { return this.repo.save(this.repo.create(data)); }
  findByPatient(patientId: string) { return this.repo.find({ where: { patientId }, order: { createdAt: 'DESC' } }); }
  findByDoctor(doctorId: string)   { return this.repo.find({ where: { doctorId }, order: { createdAt: 'DESC' } }); }
  findOne(id: string)              { return this.repo.findOne({ where: { id } }); }
}
