import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('scheine_form')
export class ScheineForm extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  scheine_type: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @Column({ type: 'character varying' })
  // field: string;
  field: 'boolean' | 'number' | 'string' | 'date' | 'object';

  @Column()
  data_type: string;

  @Column()
  required: boolean;
}
