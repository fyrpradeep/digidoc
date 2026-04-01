import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('otps')
export class OtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mobile: string;

  @Column()
  otp: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
