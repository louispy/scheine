import { BaseEntity as TypeOrmBaseEntity, Column, BeforeInsert, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @BeforeInsert()
  generateUuid() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
