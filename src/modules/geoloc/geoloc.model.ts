
import { Document} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isValid, international } from 'phone-cd';

export type GeolocDocument = Geoloc & Document;

@Schema(
  /**
   * { timestemps: true }
   * Is used to make sure that the createdAt and updatedAt fields are created
   * 
   
   */
  { timestamps: true },
  
  
)
export class Geoloc {

  @Prop({ required: true })
  vehicule_id: string;

  @Prop([

  ])
  loc: {lat:number,long:number,fluel_level:number,timestamp:number,server_timestamp:number}[];

}

export const GeolocSchema = SchemaFactory.createForClass(Geoloc);
