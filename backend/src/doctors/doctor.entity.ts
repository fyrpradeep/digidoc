import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true })       mobile: string;
  @Column({ nullable: true })     name: string;
  @Column({ nullable: true })     email: string;
  @Column({ nullable: true })     specialty: string;
  @Column({ nullable: true })     degree: string;
  @Column({ nullable: true })     college: string;
  @Column({ nullable: true })     experience: string;
  @Column({ nullable: true })     regNo: string;
  @Column({ nullable: true })     fee: string;
  @Column({ nullable: true })     bio: string;
  @Column({ nullable: true })     photoUrl: string;
  @Column({ default: 'pending' }) status: 'pending' | 'approved' | 'rejected' | 'suspended';
  @Column({ default: false })     isOnline: boolean;
  @Column({ type: 'float', default: 0 }) rating: number;
  @Column({ default: 0 })         totalConsultations: number;
  @Column({ default: true })      isActive: boolean;
  @CreateDateColumn()             createdAt: Date;
  @UpdateDateColumn()             updatedAt: Date;
}
