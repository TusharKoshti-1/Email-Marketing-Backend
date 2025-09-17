import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('domains')
export class Domain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.domains, { onDelete: 'CASCADE' })
  user: User;
}