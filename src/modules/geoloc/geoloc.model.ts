
import { Document} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as _Schema } from 'mongoose';




const LocSchema = new  _Schema(
  {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    fluel_level: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    server_timestamp: { type: Number, required: true },
    allumage: { type: Boolean, required: true },
  },
  { timestamps: true, _id: false },
);


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

  @Prop({ required: true, ref: 'Vehicule' })
  vehicule_id: string

  @Prop({  type: Array, of : LocSchema })
  loc: Array< 
  {
    lat: number;
    long: number;
    fluel_level: number;
    timestamp: number;
    server_timestamp: number;
    allumage: boolean;

  }>;

}

export const GeolocSchema = SchemaFactory.createForClass(Geoloc);
