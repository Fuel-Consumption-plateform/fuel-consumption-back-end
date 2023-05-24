import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSiteDto } from './create.dto';

export class UpdateSiteDto extends PartialType(
  OmitType(CreateSiteDto, [] as const),
) {}
