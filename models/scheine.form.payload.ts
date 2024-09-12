import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsValidRegex } from '../lib/regex.validator';

export class ScheineFormPayload {
  @IsOptional()
  scheine_type?: string;

  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @IsIn(['boolean', 'number', 'string', 'date', 'object'])
  data_type: 'boolean' | 'number' | 'string' | 'date' | 'object';

  @IsNotEmpty()
  required: boolean;

  @IsOptional()
  @IsValidRegex()
  regex?: string;

  @IsOptional()
  format_sample?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScheineFormPayload)
  children?: ScheineFormPayload[];

}
