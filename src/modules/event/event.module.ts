import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Eventvehicule, EventvehiculeSchema } from './event.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Eventvehicule.name, schema: EventvehiculeSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
