import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateScheinePayload {
  @IsNotEmpty()
  @IsUUID(4)
  doctor_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  patient_id: string;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsUUID(4)
  form_id?: string;

  @IsNotEmpty()
  data: Object;
}

interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  insurance_number: string;
}

interface Doctor {
  id: string;
  name: string;
  doctor_number: string;
  signature: string;
}

export interface CreateScheineResponse {
  id: string;
  type: string;
  patient: Patient;
  doctor: Doctor;
  data: Object;
  created_at: string;
  pdf_base64: string;
}

export class GetScheineQuery {
  @IsOptional()
  @IsUUID()
  patient_id?: string;

  @IsOptional()
  @IsUUID()
  doctor_id?: string;

  @IsOptional()
  @Matches('^(\\d{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$') // YYYY-MM-DD
  start_date?: string;

  @IsOptional()
  @Matches('^(\\d{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$') // YYYY-MM-DD
  end_date?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
