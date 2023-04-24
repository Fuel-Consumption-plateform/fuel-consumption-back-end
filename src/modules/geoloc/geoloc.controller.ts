import { BadRequestException, Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectIdPipe } from '../user/utils/pipeId';
import { Schema } from 'mongoose';
import { Geoloc } from './geoloc.model';

@Controller('geoloc')
export class GeolocController {
    constructor(private geolocService: GeolocService) {}


    @Get()
    @UseGuards(JwtAuthGuard)
    async find(
    ) {
      const geoloc = await this.geolocService.find();
      if (geoloc) return geoloc ;
      else throw new BadRequestException({ message: 'Geoloc not found.' });
    }


    @Get(':date')
    @UseGuards(JwtAuthGuard)
      async findByDate(@Param('date') date: Date) {
        try {
          const result = await this.geolocService.findByDate({date});

          if(result)  return result;
            else throw new BadRequestException({ message: 'Geoloc not found.' });
         
        } catch (error) {
          
        }
      }
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
      @Param('id', new ObjectIdPipe()) _id: Schema.Types.ObjectId,
    ): Promise<{geoloc:Geoloc}> {
      const geoloc = await this.geolocService.findOne({ _id });
      if (geoloc) return {geoloc} ;
      else throw new BadRequestException({ message: 'Geoloc not found.' });
    }
}
