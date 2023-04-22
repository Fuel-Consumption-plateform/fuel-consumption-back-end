import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GeolocService {

    // add schedule service here
    constructor() {}

    @Cron('0 0 0 * * *')
    async handleCron() {
        // do something
        
    }
}
