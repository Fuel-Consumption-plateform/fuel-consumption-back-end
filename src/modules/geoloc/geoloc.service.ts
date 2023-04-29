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
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';



@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

@Injectable()
export class GeolocService {
  // add schedule service here and import mongoose model
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer()  server: Server;
  afterInit(server: Server) {
    this.logger.log('WebSocket Server Initialized');
  }

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel(Geoloc.name)  private model: Model<GeolocDocument>,
    private deviceservice:DeviceService
    
  ) {}

  // after every 1 minute
//  @Cron('*/5 * * * * *', { name: 'fetchdata' })
  async handleCron() {
    // start message cron
    const job = this.schedulerRegistry.getCronJob('fetchdata');
    job.stop();

    // get All data vehicle
    const vehicules = await this.model.find().populate('vehicule_id');
    //console.log('ICIIIIIIIIIIIIIII',vehicules);
    
    
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

            //console.log(data);
            // save data to db

            if( data.length > 0){
            

           const loc=   data.map((item) =>{
                return {
                  'lat':item['position.latitude'],
                  'long':item['position.longitude'],
                  'fuel_level':convertFuel_levl(item['lls.value.1'],calibration),
                  'timestamp': item['timestamp'],
                  'server_timestamp': item['server.timestamp'],
                  'allumage': item['engine.ignition.status'],
                  'date':   timestampToDate(item['server.timestamp']) 
                  
                }
              })

    
          

              
            //console.log("LOCCCCCCC",loc);
            const locations =  loc[0]
      
             
             console.log('locations',locations);

               const result=  await this.model.findOneAndUpdate({vehicule_id:item.vehicule_id['_id']}, {
                $push: { loc: locations },
  
              }, {new:true})
              // console.log(result);

              if(result){
                this.afterInit(this.server);
               // console.log('send message to frontend',loc);
               // this.server.emit('event', loc)
                  

                  }
                

              
              
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

   //Get all geoloc
   async find(){
    const geoloc = await this.model.find();

    if (!geoloc) throw new BadRequestException({ message: 'Geoloc not found.' });

    return geoloc;
  }
  //Get all geoloc by Date
  async findByDate(obj: {
    date?: Date;
  }): Promise<Geoloc[]>{
    const filter: any = {};

    if (obj.date) filter.date = obj.date;
    const geoloc = await this.model.find({
      
        'loc.date': { $gte: filter }
      ,
    });

    if (!geoloc) throw new BadRequestException({ message: 'Geoloc not found.' });

    return geoloc;
  }

  async findOne(obj: {
    _id?: Schema.Types.ObjectId;
    vehicule_id?: string;
  }): Promise<GeolocDocument> {
    const filter: any = {};

    if (obj._id) filter._id = obj._id;

    const geoloc = await this.model.findOne(filter);

    if (!geoloc) throw new BadRequestException({ message: 'Geoloc not found.' });

    return geoloc;
  }



  
}
