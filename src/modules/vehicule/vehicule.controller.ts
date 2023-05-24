import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { Vehicule } from './vehicule.model';
import { CreateVehiculeDto } from './dto/create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectIdPipe } from '../user/utils/pipeId';
import { Schema, Types } from 'mongoose';
import { UpdateVehiculeDto } from './dto/update.dto';
import { UpdateDeviceDto } from '../device/dto/update.dto';
import { DeviceService } from '../device/device.service';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { extname } from 'path';

const directoryFiles = process.env.FILES_DIRECTORY || './uploads/csv';

if (!fs.existsSync(directoryFiles)) {
  try {
    fs.mkdirSync(directoryFiles);
  } catch (err) {
    console.error(err);
  }
}
@Controller('vehicule')
export class VehiculeController {
  constructor(private vehiculeService: VehiculeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async find() {
    const vehicule = await this.vehiculeService.find();
    if (vehicule) return vehicule;
    else throw new BadRequestException({ message: 'Vehicule not found.' });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', new ObjectIdPipe()) _id: Schema.Types.ObjectId,
  ): Promise<{ vehicule: Vehicule }> {
    const vehicule = await this.vehiculeService.findOne({ _id });
    if (vehicule) return { vehicule };
    else throw new BadRequestException({ message: 'Vehicule not found.' });
  }

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      fileFilter: (req, file, callback) => {
        console.log(file);
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(
            new UnauthorizedException('Only csv are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: directoryFiles,
        filename: (req, file, cb) => {
          const randomName =
            new Date().getTime() + Math.floor(Math.random() + 1000); //ile.originalname.split('.');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createVehicule(
    @UploadedFiles() file,
    @Body() vehiculeData: CreateVehiculeDto,
  ): Promise<any> {
    console.log(file);
    if (file) {
      const urlFile = file[0].path;
      const vehicule = await this.vehiculeService.create(vehiculeData, urlFile);

      if (vehicule) {
        return { vehicule };
        // return { message: 'Vehicule created successfully', vehicule };
      }
    } else {
      throw new BadRequestException({ message: 'file is required' });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ObjectIdPipe()) id: Schema.Types.ObjectId,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
  ): Promise<{ vehicule: Vehicule }> {
    const vehicule = await this.vehiculeService.update(id, updateVehiculeDto);
    return { vehicule };
  }
}
