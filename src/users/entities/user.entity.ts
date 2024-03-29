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

  @Index({ unique: true })
<<<<<<< HEAD
  @Column({ unique: true, nullable: false })
  email: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  password: string;

=======
  @Column()
  email: string;

>>>>>>> 547c72267f7da135033b6cdf37183b78d0774f41
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
<<<<<<< HEAD
  firebaseUuid: string;
=======
>>>>>>> 547c72267f7da135033b6cdf37183b78d0774f41
}
