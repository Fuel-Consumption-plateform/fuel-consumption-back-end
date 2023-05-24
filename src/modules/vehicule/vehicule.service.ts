import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, get, version } from 'mongoose';
import { Vehicule, VehiculeDocument } from './vehicule.model';
import { CreateVehiculeDto } from './dto/create.dto';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { UpdateVehiculeDto } from './dto/update.dto';
import { GeolocService } from '../geoloc/geoloc.service';
import mongoose from 'mongoose';
import { DeviceService } from '../device/device.service';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectModel(Vehicule.name)
    private model: Model<VehiculeDocument>,
    private geolocService: GeolocService,
    private deviceService: DeviceService,
  ) {}

  async find() {
    const vehicule = await this.model.find().populate('device_id');

    if (!vehicule)
      throw new BadRequestException({ message: 'Vehicule not found.' });

    return vehicule;
  }
  async findOne(obj: {
    _id?: Schema.Types.ObjectId;
    registration?: string;
    Num_phone?: string;
  }): Promise<VehiculeDocument> {
    const filter: any = {};

    if (obj._id) filter._id = obj._id;

    const vehicule = await this.model.findOne(filter);

    if (!vehicule)
      throw new BadRequestException({ message: 'Vehicule not found.' });

    return vehicule;
  }

  async create(
    vehiculeData: CreateVehiculeDto,
    calibrationFilePath: string,
  ): Promise<Vehicule> {
    console.log('ICCCII', calibrationFilePath);
    const vehicule = await new this.model(vehiculeData);

    if (vehicule) {
      // Lecture du fichier CSV et ajout des données de calibration au record de véhicule
      const calibrationData = [];

      // pour ouvrir et lire le contenu du fichier CSV
      // fs.createReadStream('./uploads/csv/1682163012119.csv')
      fs.createReadStream(calibrationFilePath)
        //Pipe pour lire les lignes du fichier CSV et traiter chaque ligne comme un objet
        .pipe(csv())
        .on('data', (row) => {
          // console.log(row);
          //push data in calibrationData
          calibrationData.push({
            litres: row['Litres'],
            sensor_readings: row['Sensor Readings'],
          });
        })
        .on('end', () => {
          //pass calibrationData in calibration
          // console.log(calibrationData);
          vehicule.calibration = calibrationData;
          console.log(vehicule.calibration);

          return vehicule.save().then(async (res) => {
            console.log(res._id);
            const vehicule_id_en_string = res._id.toString();
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mongoose = require('mongoose');
            const _id = new mongoose.mongo.ObjectId(res.device_id);
            console.log(_id);
            const device = await this.deviceService.update(_id, { used: true });
            console.log(device);
            const geoloc = await this.geolocService.createGeoloc({
              vehicule: vehicule_id_en_string,
            });

            console.log(geoloc);
          });
        });
      console.log('ICIIIIIIIIII');
      console.log(calibrationData);
      vehicule.calibration = calibrationData;
      console.log('ICIIIIIIIIIIDATA');
      console.log(vehicule.calibration);
      return;
    }
  }

  async update(
    _id: Schema.Types.ObjectId,
    updateVehiculeDto: UpdateVehiculeDto,
  ): Promise<VehiculeDocument> {
    try {
      const vehicule = await this.model.findOneAndUpdate(
        { _id },
        { $set: updateVehiculeDto },
        { new: true },
      );

      if (!vehicule)
        throw new NotFoundException({ message: 'Vehicule not found' });

      return vehicule;
    } catch (e) {
      throw new BadRequestException({ message: e.message });
    }
  }
}
