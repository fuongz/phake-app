import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  status: string;

  @Column()
  sort: string;

  @Column()
  os: string;

  @Column()
  country_code: string;

  @Column()
  version: string;

  @Column()
  parent_id: number;

  @Column()
  created_at: number;

  @Column()
  updated_at: number;
}
