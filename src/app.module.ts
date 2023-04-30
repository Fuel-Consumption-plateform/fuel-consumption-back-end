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


@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_DB_CONNECTION,
      mongooseModuleOptions,
    ),
    MorganModule,
    UserModule,
    AuthModule,
    DeviceModule,
    VehiculeModule,
    GeolocModule,
    SitesModule,
  ],
  controllers: [AppController, GeolocController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: MorganInterceptor('dev') },
  ],
})
export class AppModule {}
