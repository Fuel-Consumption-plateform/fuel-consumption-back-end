import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Site, SiteDocument } from './sites.model';
import { CreateSiteDto } from './dto/create.dto';
import { UpdateSiteDto } from './dto/update.dto';

@Injectable()
export class SitesService {

    constructor(@InjectModel(Site.name)
    private model: Model<SiteDocument>) {

    }

     //Get all sites
     async find(){
        const site = await this.model.find();

        if (!site) throw new BadRequestException({ message: 'site not found.' });

        return site;
      }

      
      async findOne(obj: {
        _id?: Schema.Types.ObjectId;
        name?: string;
      
      }): Promise<SiteDocument> {
        const filter: any = {};

        if (obj._id) filter._id = obj._id;

        const site = await this.model.findOne(filter);

        if (!site) throw new BadRequestException({ message: 'site not found.' });

        return site;
      }

      async createsite(createsite: CreateSiteDto) {
        const siteExist = await this.model.findOne({
          name: createsite.name
        });
        if (siteExist) throw new BadRequestException({ message: 'site exist' });

        try {
          const site = await new this.model(createsite).save();
          return site;
        } catch (e) {
          throw new BadRequestException({ message: e.message });
        }
      }

      async update(
        _id: Schema.Types.ObjectId,
        updatesiteDto: UpdateSiteDto,
      ): Promise<SiteDocument> {
        try {
          const site = await this.model.findOneAndUpdate(
            { _id },
            { $set: updatesiteDto },
            { new: true },
          );

          if (!site) throw new NotFoundException({ message: 'site not found' });

          return site;
        } catch (e) {
          throw new BadRequestException({ message: e.message });
        }
      }
}
