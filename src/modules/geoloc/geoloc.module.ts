import { Module } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Geoloc, GeolocSchema } from './geoloc.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geoloc.name, schema: GeolocSchema }]),
       
  ],
  providers: [GeolocService]
})
export class GeolocModule {}
