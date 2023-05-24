import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import mongooseModuleOptions from './config/mongoose-connection';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeviceModule } from './modules/device/device.module';
import { VehiculeModule } from './modules/vehicule/vehicule.module';
import { GeolocController } from './modules/geoloc/geoloc.controller';
import { GeolocModule } from './modules/geoloc/geoloc.module';
import { SitesModule } from './modules/sites/sites.module';
import { EventModule } from './modules/event/event.module';

const {
  MONGO_DB_CONNECTION = 'mongodb+srv://williammutombomutombo:william12345@cluster0.oaktfms.mongodb.net/fuelComsuptionDB',
} = process.env;
@Module({
  imports: [
    MongooseModule.forRoot(MONGO_DB_CONNECTION, mongooseModuleOptions),
    MorganModule,
    UserModule,
    AuthModule,
    DeviceModule,
    VehiculeModule,
    GeolocModule,
    SitesModule,
    EventModule,
  ],
  controllers: [AppController, GeolocController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: MorganInterceptor('dev') },
  ],
})
export class AppModule {}
