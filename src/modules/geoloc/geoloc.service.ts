import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import sendRequestToFlespi from 'utils/flespiRequest';

@Injectable()
export class GeolocService {
  // add schedule service here
  constructor(private schedulerRegistry: SchedulerRegistry, ) {}

  // after every 5 seconds
 // @Cron('*/5 * * * * *', { name: 'fetchdata' })
  async handleCron() {
    // start message cron
    const job = this.schedulerRegistry.getCronJob('fetchdata');
    job.stop();

    // get All data vehicle

    console.log('start message cron');
    const data = await sendRequestToFlespi('1156612', 'lastTimeStamp');
    console.log(data);

    job.start();
  }


  async getAllVehicle() {
    // get all vehicle from db
  }
}
