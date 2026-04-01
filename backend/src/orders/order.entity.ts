import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column()                       patientId: string;
  @Column({ nullable: true })     prescriptionId: string;
  @Column({ type: 'jsonb' })      items: any[];
  @Column({ type: 'jsonb' })      address: any;
  @Column({ type: 'decimal' })    totalAmount: number;
  @Column({ default: 'pending' }) status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  @Column({ nullable: true })     trackingNo: string;
  @Column({ default: 'pending' }) paymentStatus: 'pending' | 'paid' | 'refunded';
  @Column({ nullable: true })     paymentId: string;
  @CreateDateColumn()             createdAt: Date;
  @UpdateDateColumn()             updatedAt: Date;
}
