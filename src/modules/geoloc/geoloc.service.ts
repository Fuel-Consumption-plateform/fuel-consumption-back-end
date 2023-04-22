import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import sendRequestToFlespi from 'utils/flespiRequest';
import { Geoloc, GeolocDocument } from './geoloc.model';
import { Model } from 'mongoose';
import { DeviceService } from '../device/device.service';
import { Reading, convertFuel_levl } from 'utils/convertFuel_levl';

@Injectable()
export class GeolocService {
  // add schedule service here and import mongoose model
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel(Geoloc.name)  private model: Model<GeolocDocument>,
    
  ) {}

  // after every 5 seconds
   @Cron('*/5 * * * * *', { name: 'fetchdata' })
  async handleCron() {
    // start message cron
    const job = this.schedulerRegistry.getCronJob('fetchdata');
    job.stop();

    // get All data vehicle
    const vehicles = await this.model.find().populate('vehicule_id');
     
     if(vehicles){
        // await promise all
        // await Promise.all(vehicles.map(async (item) => {
        //   // find channel id by id in device id: item.vehicule_id
        //   const channel = await this.deviceService.findOne();
        //   const lastTimeStamp = item.loc[item.loc.length - 1].server_timestamp;

        //   if (channel) {
        //     // get data from flespi
        //     const data = await sendRequestToFlespi(
        //       channel.channel,
        //       lastTimeStamp,
        //     );

        //     // save data to db
        //     await this.model.create(data);
        //   }
        // }));

     }

     const calibration : Array<Reading>= [
        {
           sensor_readings:9,
           litres:0
        },
        {
              sensor_readings:151,
                litres:5
        },
        {
                sensor_readings:362,
                litres:10
        },
        {
                sensor_readings:552,
                litres:15
        },
        {
                sensor_readings:752,
                litres:20
        },

     ]
     console.log(convertFuel_levl(9,calibration))
    console.log('start message cron');
   // const data = await sendRequestToFlespi('1156612', 'lastTimeStamp');
   // console.log(data);

    job.start();
  }

  async getAllVehicle() {
    // get all vehicle from db


  }
}
