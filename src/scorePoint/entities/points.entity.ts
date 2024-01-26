import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Points {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  documentNumber: string;

  @Index({ unique: true })
  @Column()
  plateNumber: string;

  @Column('int')
  totalScore: number;

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
