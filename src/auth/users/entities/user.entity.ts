import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ nullable: true })
  name: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  email: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  password: string;

  @Index()
  @Column({ nullable: true })
  uuid: string | null;

  @CreateDateColumn({
    precision: 0,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    precision: 0,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;
}
