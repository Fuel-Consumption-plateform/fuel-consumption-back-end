import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateVehiculeDto } from './create.dto';

export class UpdateVehiculeDto extends PartialType(
  OmitType(CreateVehiculeDto, [] as const),
) {}
