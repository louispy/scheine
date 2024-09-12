import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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
