import { Module } from '@nestjs/common';
import { GeolocService } from './geoloc.service';

@Module({
  providers: [GeolocService]
})
export class GeolocModule {}
