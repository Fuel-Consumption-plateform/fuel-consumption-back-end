
import { Document} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isValid, international } from 'phone-cd';

export type DeviceDocument = Device & Document;

@Schema(
  /**
   * { timestemps: true }
   * Is used to make sure that the createdAt and updatedAt fields are created
   * 
   
   */
  { timestamps: true },
  
  
)
export class Device {

  @Prop({ required: true })
  fabricant: string;

  @Prop({ required:true })
  IMEI: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return isValid(v);
      },
      message: (props) => `${props.value} is not supported!`,
    },
    set: (v: string) => `+${international(v)}`,
  })
  Num_phone: string;

  @Prop({ required:true })
  Model: string;

  @Prop({ required:false })
  channel: string;

  @Prop({ default: false })
  used: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
