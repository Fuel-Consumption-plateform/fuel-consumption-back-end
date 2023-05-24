import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { isValid, international } from 'phone-cd';

export type EventvehiculeDocument = Eventvehicule & Document;

@Schema(
  /**
   * { timestemps: true }
   * Is used to make sure that the createdAt and updatedAt fields are created
   * 
   
   */
  { timestamps: true },
)
export class Eventvehicule {
  @Prop({ required: true })
  vehicule_id: string;

  @Prop({ required: true })
  date_start: Date;

  @Prop()
  date_end?: Date;

  @Prop({ required: true })
  quantite_start: number;

  @Prop()
  quantite_end: number;

  @Prop(
    raw({
      lat: { type: Number },
      long: { type: Number },
    }),
  )
  postionnement: { lat: number; long: number };

  @Prop({ enum: ['chargement', 'dechargement'] })
  type_event: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const EventvehiculeSchema = SchemaFactory.createForClass(Eventvehicule);
