/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import sendRequestToFlespi from 'utils/flespiRequest';
import { Geoloc, GeolocDocument } from './geoloc.model';
import { Model, Schema, Types } from 'mongoose';
import { DeviceService } from '../device/device.service';
import { Reading, convertFuel_levl } from 'utils/convertFuel_levl';
import { CreateGeolocDto } from './dto/create.dto';
import { ObjectId } from 'bson';
import { timestampToDate } from 'utils/timestampToDate';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { map } from 'modern-async'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class GeolocService {
  // add schedule service here and import mongoose model
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    this.logger.log('WebSocket Server Initialized');
  }

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel(Geoloc.name) private model: Model<GeolocDocument>,
    private deviceservice: DeviceService,
  ) {}

  // after every 1 minute
  @Cron('*/60 * * * * *', { name: 'fetchdata' })
  async handleCron() {
    // start message cron
    const job = this.schedulerRegistry.getCronJob('fetchdata');
    job.stop();

    const vehicules = await this.model.find().populate('vehicule_id');
  
      // var arr = [1, 2, 3, 4, 5];

       for await(const item of vehicules){
         console.log('start', item['model']);
         const calibration = item.vehicule_id['calibration'];
         // find channel id by id in device id: item.vehicule_id
         const channel = await this.deviceservice.findOne({
           _id: item.vehicule_id['device_id'],
         });
         console.log(channel);
         let lastTimeStamp;
         // verify if loc is not empty
         if (item?.loc && item.loc.length > 0) {
           lastTimeStamp = item.loc[item?.loc.length - 1].server_timestamp;
           console.log(lastTimeStamp);
         } else {
           lastTimeStamp = 0;
         }
         if (channel) {
           // get data from flespi
           const data = (await sendRequestToFlespi(
             channel.channel,
             lastTimeStamp,
           )) as any[];
           if (data?.length > 0) {
             console.log('data', data);
             const loc = data.map((x) => {
               console.log('xxxx', x);
               return {
                 lat: x['position.latitude'],
                 long: x['position.longitude'],
                 fuel_level: convertFuel_levl(x['lls.value.1'], calibration),
                 timestamp: x['timestamp'],
                 server_timestamp: x['server.timestamp'],
                 allumage: x['engine.ignition.status'],
                 date: timestampToDate(x['server.timestamp']),
               };
             });
             const locations = loc[0];
             console.log(locations)
             const result = await this.model.findOneAndUpdate(
               { vehicule_id: item.vehicule_id['_id'] },
               {
                 $push: { loc: locations },
               },
               { new: true },
             );
             // console.log(result);
             if (result) {
               //ICI SOCKET
               this.afterInit(this.server);
               // console.log('send message to frontend',loc);
               // this.server.emit('event', loc)
             }
           }
         }
         console.log('end');
       }
        

     
     
    if (vehicules) {
      // do an asychronous function with vehicules datas

      await Promise.all(
        vehicules.map(async item => {
          
          // console.log('start', item['model']);
          // const calibration = item.vehicule_id['calibration'];
          // // find channel id by id in device id: item.vehicule_id
          // const channel = await this.deviceservice.findOne({
          //   _id: item.vehicule_id['device_id'],
          // });
          // console.log(channel);
          // let lastTimeStamp;
          // // verify if loc is not empty
          // if (item?.loc && item.loc.length > 0) {
          //   lastTimeStamp = item.loc[item?.loc.length - 1].server_timestamp;
          //   console.log(lastTimeStamp);
          // } else {
          //   lastTimeStamp = 0;
          // }

          // if (channel) {
          //   // get data from flespi
          //   const data = (await sendRequestToFlespi(
          //     channel.channel,
          //     lastTimeStamp,
          //   )) as any[];

          //   //console.log(data);
          //   // save data to db

          //   if (data?.length > 0) {
          //     console.log('data', data);

          //     const loc = data.map((x) => {
          //       console.log('xxxx', x);
          //       return {
          //         lat: x['position.latitude'],
          //         long: x['position.longitude'],
          //         fuel_level: convertFuel_levl(x['lls.value.1'], calibration),
          //         timestamp: x['timestamp'],
          //         server_timestamp: x['server.timestamp'],
          //         allumage: x['engine.ignition.status'],
          //         date: timestampToDate(x['server.timestamp']),
          //       };
          //     });

          //     const locations = loc[0];
          //     console.log('locations', locations);

          //     const result = await this.model.findOneAndUpdate(
          //       { vehicule_id: item.vehicule_id['_id'] },
          //       {
          //         $push: { loc: locations },
          //       },
          //       { new: true },
          //     );
          //     // console.log(result);

          //     if (result) {
          //       //ICI SOCKET
          //       this.afterInit(this.server);
          //       // console.log('send message to frontend',loc);
          //       // this.server.emit('event', loc)
          //     }
          //   }
          // }
          // console.log('end');
         
        
        }),
      );
    } else {
      console.log('no vehicule in geoloc');
    }
    console.log('start message cron');

    job.start();
  }

  async createGeoloc(obj: any) {
    const geolocExist = await this.model.findOne({
      vehicule_id: obj.vehicule_id,
    });
    if (geolocExist) throw new BadRequestException({ message: 'Geoloc exist' });

    try {
      const vehicule = obj.vehicule;
      const geoloc = new this.model({ vehicule_id: vehicule });
      const result = await geoloc.save();
      return result;
    } catch (e) {
      throw new BadRequestException({ message: e.message });
    }
  }

  //Get all geoloc
  async find() {
    const geoloc = await this.model.find();

    if (!geoloc)
      throw new BadRequestException({ message: 'Geoloc not found.' });

    return geoloc;
  }
  //Get all geoloc by Date
  async findByDate(obj: { date?: Date }): Promise<Geoloc[]> {
    const filter: any = {};

    if (obj.date) filter.date = obj.date;
    const geoloc = await this.model.find({
      'loc.date': { $gte: filter },
    });

    if (!geoloc)
      throw new BadRequestException({ message: 'Geoloc not found.' });

    return geoloc;
  }

  async findOne(obj: { vehicule_id?: string; date?: string }) {
    const filter: any = {};

    // if (obj._id) filter._id = obj._id;
    // const geoloc = await this.model.findOne(filter);
    // if (!geoloc) throw new BadRequestException({ message: 'Geoloc not found.'
    // filter one day in loc array and display only loc array
    const datefinal = new Date(obj.date);
    const geoloc = await this.model.aggregate([
      {
        $match: { vehicule_id: obj.vehicule_id },
      },
      {
        $project: {
          loc: {
            $filter: {
              input: '$loc',
              as: 'loc',
              cond: {
                $eq: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$$loc.date',
                    },
                  },
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: datefinal,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    if (!geoloc)
      throw new BadRequestException({ message: 'Geoloc not found.' });
    // dispay only loc array
    const loc = geoloc[0].loc ? geoloc[0].loc : [];
    return loc;
  }
}
