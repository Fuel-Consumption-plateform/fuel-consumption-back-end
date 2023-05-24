import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateSiteDto {
  @IsNotEmpty({ message: 'Name is required' })
  name?: string;

  geoLoc?: {
    lat: number;
    long: number;
  };
}
