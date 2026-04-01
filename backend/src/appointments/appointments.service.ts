import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AppointmentsService {
  constructor(@InjectRepository(AppointmentEntity) private repo: Repository<AppointmentEntity>) {}
  async create(data: Partial<AppointmentEntity>) {
    return this.repo.save(this.repo.create({ ...data, roomId: uuid() }));
  }
  findByPatient(id: string) { return this.repo.find({ where: { patientId: id }, order: { createdAt: 'DESC' } }); }
  findByDoctor(id: string)  { return this.repo.find({ where: { doctorId: id }, order: { createdAt: 'DESC' } }); }
  findOne(id: string)       { return this.repo.findOne({ where: { id } }); }
  async start(id: string) {
    await this.repo.update(id, { status: 'active', startedAt: new Date() });
    return this.findOne(id);
  }
  async end(id: string) {
    await this.repo.update(id, { status: 'completed', endedAt: new Date() });
    return this.findOne(id);
  }
}
