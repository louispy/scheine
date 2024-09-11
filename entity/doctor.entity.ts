import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('doctor')
export class Doctor extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  doctor_number: string;

  @Column()
  signature: string;

  @Column()
  medical_practice_number: string;
}
