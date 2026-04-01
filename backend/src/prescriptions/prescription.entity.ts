import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('prescriptions')
export class PrescriptionEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column()                       patientId: string;
  @Column()                       doctorId: string;
  @Column({ nullable: true })     appointmentId: string;
  @Column()                       diagnosis: string;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'jsonb', default: [] })   medicines: any[];
  @Column({ type: 'jsonb', default: [] })   advice: string[];
  @Column({ type: 'decimal', default: 0 })  totalAmount: number;
  @Column({ default: 'active' })            status: string;
  @CreateDateColumn()                       createdAt: Date;
}
