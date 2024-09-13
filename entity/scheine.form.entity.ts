import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('scheine_form')
export class ScheineForm extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id?: string;

  @Column({ type: 'character varying' })
  data_type: 'boolean' | 'number' | 'string' | 'date' | 'object';

  @Column()
  field: string;

  @Column()
  required: boolean;

  @Column({ nullable: true })
  regex?: string;

  @Column({ nullable: true })
  format_sample?: string;
}
