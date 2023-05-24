import { Module } from '@nestjs/common';
import { VehiculeController } from './vehicule.controller';
import { VehiculeService } from './vehicule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicule, VehiculeSchema } from './vehicule.model';
import { DeviceService } from '../device/device.service';
import { Device, DeviceSchema } from '../device/device.model';
import { DeviceModule } from '../device/device.module';
import { GeolocModule } from '../geoloc/geoloc.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicule.name, schema: VehiculeSchema },
    ]),
    DeviceModule,
    GeolocModule,
  ],
  controllers: [VehiculeController],
  providers: [VehiculeService],
})
export class VehiculeModule {}
