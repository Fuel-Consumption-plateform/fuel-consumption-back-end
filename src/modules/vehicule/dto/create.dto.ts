import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateVehiculeDto {
  @IsNotEmpty({ message: 'Registration is required' })
  device_id?: string;

  @IsNotEmpty({ message: 'Registration is required' })
  registration?: string;

  @IsNotEmpty({ message: 'Model is required' })
  model?: string;

  quantity_max?: number;

  //   calibration?:{litres:number,sensor_readings:number }[]
}
