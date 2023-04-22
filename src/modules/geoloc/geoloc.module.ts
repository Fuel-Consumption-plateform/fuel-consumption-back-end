import { Module } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [GeolocService,],
 
})
export class GeolocModule {}
