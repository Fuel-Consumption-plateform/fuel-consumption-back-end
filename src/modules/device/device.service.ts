import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './device.model';
import { Model, Schema } from 'mongoose';
import { CreateDeviceDto } from './dto/create.dto';
import { UpdateDeviceDto } from './dto/update.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private model: Model<DeviceDocument>,
  ) {}

  //Get all devices
  async find() {
    const device = await this.model.find();

    if (!device)
      throw new BadRequestException({ message: 'Device not found.' });

    return device;
  }

  //Get device all no used
  async findDeviceNoUsed() {
    const device = await this.model.find({
      used: false,
    });

    if (!device)
      throw new BadRequestException({ message: 'Device not found.' });

    return device;
  }

  async findOne(obj: {
    _id?: Schema.Types.ObjectId;
    IMEI?: string;
    Num_phone?: string;
  }): Promise<DeviceDocument> {
    const filter: any = {};

    if (obj._id) filter._id = obj._id;

    const device = await this.model.findOne(filter);

    if (!device)
      throw new BadRequestException({ message: 'Device not found.' });

    return device;
  }

  async createDevice(createDevice: CreateDeviceDto) {
    const deviceExist = await this.model.findOne({
      IMEI: createDevice.IMEI,
      Num_phone: createDevice.Num_phone,
    });
    if (deviceExist) throw new BadRequestException({ message: 'Device exist' });

    try {
      const device = await new this.model(createDevice).save();
      return device;
    } catch (e) {
      throw new BadRequestException({ message: e.message });
    }
  }

  async update(
    _id: Schema.Types.ObjectId,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceDocument> {
    try {
      const device = await this.model.findOneAndUpdate(
        { _id },
        { $set: updateDeviceDto },
        { new: true },
      );

      if (!device) throw new NotFoundException({ message: 'Device not found' });

      return device;
    } catch (e) {
      throw new BadRequestException({ message: e.message });
    }
  }
}
