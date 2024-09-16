import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('patient')
export class Patient extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column()
  insurance_number: string;

  @Column()
  cost_unit_identification: string;

  @Column()
  establishment_number: string;

  @Column()
  status: string;

  @Column()
  postcode: string;

  @Column()
  place_of_residence: string;

  @Column()
  house_number: string;

  @Column()
  account_holder: string;

  @Column()
  iban: string;

  @Column()
  financial_institution: string;

  @Column()
  bic: string;

  @Column()
  employed_at: string;

  @Column()
  employer_address: string;

  @Column()
  self_employed: boolean;

  @Column()
  unemployed: boolean;

  @Column()
  artist_publicist: boolean;

  @Column({ type: 'date' })
  employment_termination_date: string;

  @Column()
  signature: string;
}
