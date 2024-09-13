import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Doctor } from './doctor.entity';
import { Patient } from './patients.entity';

@Entity('scheine')
export class Scheine extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  scheine_type: string;

  @Column({ type: 'uuid', nullable: true })
  form_id?: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  doctor_id: string;

  @Column({ type: 'json' })
  data: Object;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
  patient: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: Doctor;
}
