import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SitesService } from './sites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectIdPipe } from '../user/utils/pipeId';
import { Schema } from 'mongoose';
import { Site } from './sites.model';
import { CreateSiteDto } from './dto/create.dto';
import { UpdateSiteDto } from './dto/update.dto';

@Controller('sites')
export class SitesController {

    constructor(private siteService: SitesService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async find(
    ) {
      const site = await this.siteService.find();
      if (site) return site ;
      else throw new BadRequestException({ message: 'site not found.' });
    }

 
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
      @Param('id', new ObjectIdPipe()) _id: Schema.Types.ObjectId,
    ): Promise<{site:Site}> {
      const site = await this.siteService.findOne({ _id });
      if (site) return {site} ;
      else throw new BadRequestException({ message: 'site not found.' });
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
      async createsite(
        @Body() siteData: CreateSiteDto,
      ): Promise<{site:Site}> {
           
        const site= await this.siteService.createsite(siteData);

        return {site}
          }
          @Put(':id')
          @UseGuards(JwtAuthGuard)
          async update(
              @Param('id', new ObjectIdPipe()) id: Schema.Types.ObjectId,
              @Body() updatesiteDto: UpdateSiteDto,
            ): Promise<{site:Site}> {
              const site = await this.siteService.update(id, updatesiteDto);
              return {site} ;
            } 
    
}
