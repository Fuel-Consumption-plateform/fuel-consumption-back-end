import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as _Schema } from 'mongoose';

import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema(
  /**
   * { timestemps: true }
   * Is used to make sure that the createdAt and updatedAt fields are created
   * 
   
   */
  { timestamps: true },
)
export class User {

  @Prop({ required: true })
  name: string;

  @Prop({  })
  email: string;

  // hash = await bcrypt.hash(password, 10);
  @Prop({ set: (v: string) => bcrypt.hashSync(v, 10) })
  password: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
