import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectIdPipe } from '../user/utils/pipeId';
import { Device } from './device.model';
import { Schema } from 'mongoose';
import { CreateDeviceDto } from './dto/create.dto';
import { GETUser } from 'src/decorators/user.decorator';
import { UpdateDeviceDto } from './dto/update.dto';

@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async find() {
    const device = await this.deviceService.find();
    if (device) return device;
    else throw new BadRequestException({ message: 'Device not found.' });
  }

  @Get('noused')
  @UseGuards(JwtAuthGuard)
  async findallDeviceNoUsed() {
    const device = await this.deviceService.findDeviceNoUsed();
    if (device) return device;
    else throw new BadRequestException({ message: 'Device not found.' });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', new ObjectIdPipe()) _id: Schema.Types.ObjectId,
  ): Promise<{ device: Device }> {
    const device = await this.deviceService.findOne({ _id });
    if (device) return { device };
    else throw new BadRequestException({ message: 'Device not found.' });
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createdevice(
    @Body() deviceData: CreateDeviceDto,
  ): Promise<{ device: Device }> {
    const device = await this.deviceService.createDevice(deviceData);

    return { device };
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ObjectIdPipe()) id: Schema.Types.ObjectId,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<{ device: Device }> {
    const device = await this.deviceService.update(id, updateDeviceDto);
    return { device };
  }
}
