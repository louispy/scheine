import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('scheine')
export class Scheine extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  doctor_id: string;
}
