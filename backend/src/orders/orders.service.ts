import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
@Injectable()
export class OrdersService {
  constructor(@InjectRepository(OrderEntity) private repo: Repository<OrderEntity>) {}
  create(data: Partial<OrderEntity>)   { return this.repo.save(this.repo.create(data)); }
  findAll()                            { return this.repo.find({ order: { createdAt: 'DESC' } }); }
  findByPatient(id: string)            { return this.repo.find({ where: { patientId: id }, order: { createdAt: 'DESC' } }); }
  findOne(id: string)                  { return this.repo.findOne({ where: { id } }); }
  findPending()                        { return this.repo.find({ where: { status: 'pending' } }); }
  async dispatch(id: string, trackingNo: string) {
    await this.repo.update(id, { status: 'dispatched', trackingNo });
    return this.findOne(id);
  }
  async deliver(id: string) {
    await this.repo.update(id, { status: 'delivered' });
    return this.findOne(id);
  }
  async updatePayment(id: string, paymentId: string) {
    await this.repo.update(id, { paymentStatus: 'paid', paymentId, status: 'confirmed' });
    return this.findOne(id);
  }
}
