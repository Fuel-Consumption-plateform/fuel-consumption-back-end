import { Module } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Geoloc, GeolocSchema } from './geoloc.model';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geoloc.name, schema: GeolocSchema }]),
    ScheduleModule.forRoot(),
    DeviceModule
       
  ],
  providers: [GeolocService],
  exports: [GeolocService]
})
export class GeolocModule {}
