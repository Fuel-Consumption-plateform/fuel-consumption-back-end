/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import sendRequestToFlespi from 'utils/flespiRequest';
import { Geoloc, GeolocDocument } from './geoloc.model';
import { Model, Types } from 'mongoose';
import { DeviceService } from '../device/device.service';
import { Reading, convertFuel_levl } from 'utils/convertFuel_levl';
import { CreateGeolocDto } from './dto/create.dto';
import { ObjectId } from 'bson';



@Injectable()
export class GeolocService {
  // add schedule service here and import mongoose model
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel(Geoloc.name)  private model: Model<GeolocDocument>,
    private deviceservice:DeviceService
    
  ) {}

  // after every 5 seconds
   @Cron('*/5 * * * * *', { name: 'fetchdata' })
  async handleCron() {
    // start message cron
    const job = this.schedulerRegistry.getCronJob('fetchdata');
    job.stop();

    // get All data vehicle
    const vehicules = await this.model.find().populate('vehicule_id');
    // console.log('ICIIIIIIIIIIIIIII',vehicules);
    
    
     if(vehicules){
        
        await Promise.all(vehicules.map(async (item) => {
          const calibration = item.vehicule_id['calibration'];
        
          // find channel id by id in device id: item.vehicule_id
          const channel = await this.deviceservice.findOne({_id: item.vehicule_id['device_id']});
          // console.log(channel);
          let lastTimeStamp ;
          if(item.loc) {
            lastTimeStamp = item.loc[item.loc.length - 1].server_timestamp;
            console.log(lastTimeStamp);
          }else{
            lastTimeStamp=0;
          }

          if (channel) {
            // get data from flespi
            const data = await sendRequestToFlespi(
              channel.channel,
              lastTimeStamp,
            ) as any[];

            // console.log(data);
            // save data to db

            if( data['result'].length > 0){
              console.log("lenght")

           const loc=   data['result'].map((item) =>{
                return {
                  'lat':item['position.latitude'],
                  'long':item['position.longitude'],
                  'fuel_level':convertFuel_levl(item['lls.value.1'],calibration),
                  'timestamp': item['timestamp'],
                  'server_timestamp': item['server.timestamp'],
                  'allumage': item['engine.ignition.status'],
                  'date': new Date(item['server.timestamp'])
                  
                }
              })
              // console.log("LOCCCCCCC",loc);
            let locations = item.loc? [ ...item.loc,loc] : loc
             
            // console.log('locations',);

              var result= await this.model.findOneAndUpdate({vehicule_id:item.vehicule_id['_id']}, {
                loc:locations
              })
              // console.log(result);
            }

            //ICI SOCKET
            
           
          }
        }));

     }
     else{
      console.log("no vehicule in geoloc")
     }
    console.log('start message cron');

    job.start();
  }

  async createGeoloc(obj: any ) {
    const geolocExist = await this.model.findOne({
      vehicule_id: obj.vehicule_id,

    });
    if (geolocExist) throw new BadRequestException({ message: 'Geoloc exist' });

    try {
      const vehicule = obj.vehicule;
      const geoloc = new this.model({ vehicule_id:vehicule });
      const result = await geoloc.save();
      return result;
     
    } catch (e) {
      throw new BadRequestException({ message: e.message });
    }
  }

  
}
