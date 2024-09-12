import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

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
  @ValidateNested()
  @Type(() => ScheineFormPayload)
  children?: ScheineFormPayload[];
}
