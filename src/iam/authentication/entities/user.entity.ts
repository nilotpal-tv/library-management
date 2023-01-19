import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';

export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ unique: true })
  phoneNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
