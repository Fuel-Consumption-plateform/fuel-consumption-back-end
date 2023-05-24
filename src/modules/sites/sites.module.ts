import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './sites.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
