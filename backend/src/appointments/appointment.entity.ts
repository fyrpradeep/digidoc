import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column()                       patientId: string;
  @Column()                       doctorId: string;
  @Column()                       type: 'video' | 'audio';
  @Column({ default: 'scheduled' }) status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  @Column({ nullable: true })     roomId: string;
  @Column({ nullable: true })     startedAt: Date;
  @Column({ nullable: true })     endedAt: Date;
  @Column({ type: 'decimal', nullable: true }) fee: number;
  @Column({ default: 'pending' }) paymentStatus: string;
  @CreateDateColumn()             createdAt: Date;
}
