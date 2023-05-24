import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as _Schema } from 'mongoose';
import { international, isValid } from 'phone-cd';
import * as bcrypt from 'bcryptjs';

export type SiteDocument = Site & Document;

@Schema(
  /**
   * { timestemps: true }
   * Is used to make sure that the createdAt and updatedAt fields are created
   * 
   * "anneeNaissance": "1997",
      "description": "null",
      "id": "3qsRcAbqGaTeKKIHLO0FPwEqHPI3",
      "immatriculation": "null",
      "nom": "panda",
      "password": "null",
      "phoneNumber": "+243971494819",
      "photoProfil": "https://firebasestorage.googleapis.com/v0/b/kumba1-451da.appspot.com/o/PhotoProfile%2Fjuin%2004%2C%20202214%3A27%3A25%20PM.jpg?alt=media&token=91c2290a-a667-474f-bebe-213dcf66046c",
      "prenom": "pablo",
      "sexe": "Homme",
      "typeMembre": "passager",
      "username": "null"
   */
  { timestamps: true },
)
export class Site {
  @Prop({ required: true })
  name: string;

  @Prop(
    raw({
      lat: { type: Number },
      long: { type: Number },
    }),
  )
  geoLoc: { lat: number; long: number };
}

export const SiteSchema = SchemaFactory.createForClass(Site);
