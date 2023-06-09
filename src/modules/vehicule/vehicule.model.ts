import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehiculeDocument = Vehicule & Document;
@Schema()
export class Vehicule extends Document {
  @Prop({ required: true, ref: 'Device' })
  device_id: string;

  @Prop({ required: true })
  registration: string;

  @Prop({ required: true })
  model: string;

  @Prop({ type: Number })
  quantity_max: number;

  @Prop([
    {
      // litres: { type: Number },
      // sensor_readings: { type: Number },
    },
  ])
  calibration: { litres: string; sensor_readings: string }[];
}

export const VehiculeSchema = SchemaFactory.createForClass(Vehicule);
