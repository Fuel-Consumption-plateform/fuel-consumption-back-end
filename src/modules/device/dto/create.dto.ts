import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty({ message: 'Fabricant is required' })
  fabricant?: string;

  @IsNotEmpty({ message: 'IMEI is required' })
  IMEI?: string;

  @IsNotEmpty({ message: 'Phone is required' })
  Num_phone?: string;

  @IsNotEmpty({ message: 'Model is required' })
  Model?: string;

  @IsOptional()
  channel?: string;

  @Optional()
  used?: boolean;
}
