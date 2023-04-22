import { Module } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Geoloc, GeolocSchema } from './geoloc.model';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geoloc.name, schema: GeolocSchema }]),
    ScheduleModule.forRoot()
       
  ],
  providers: [GeolocService]
})
export class GeolocModule {}
