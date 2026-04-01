import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('medicines')
export class MedicineEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column()                       name: string;
  @Column()                       brand: string;
  @Column()                       type: string;
  @Column()                       category: string;
  @Column({ type: 'decimal' })    price: number;
  @Column({ type: 'decimal' })    mrp: number;
  @Column({ default: 0 })         stock: number;
  @Column({ nullable: true })     description: string;
  @Column({ default: false })     requiresPrescription: boolean;
  @Column({ default: true })      isActive: boolean;
  @CreateDateColumn()             createdAt: Date;
}
