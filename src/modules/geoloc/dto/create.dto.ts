import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateGeolocDto {
  @IsNotEmpty({ message: 'vehicule is required' })
  vehicule_id?: string;


}
