import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true })       mobile: string;
  @Column({ nullable: true })     name: string;
  @Column({ nullable: true })     email: string;
  @Column({ nullable: true })     dob: string;
  @Column({ nullable: true })     gender: string;
  @Column({ nullable: true })     city: string;
  @Column({ nullable: true })     state: string;
  @Column({ nullable: true })     bloodGroup: string;
  @Column({ nullable: true })     weight: string;
  @Column({ nullable: true })     height: string;
  @Column({ nullable: true })     photoUrl: string;
  @Column({ default: true })      isActive: boolean;
  @CreateDateColumn()             createdAt: Date;
  @UpdateDateColumn()             updatedAt: Date;
}
