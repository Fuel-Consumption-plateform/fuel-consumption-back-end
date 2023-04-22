
// function convert readings value to fuel level

export interface Reading {
    litres: number;
     sensor_readings: number;
}
export function convertFuel_levl(fuel_level: number, readings:  Array<Reading>)
{
    // filter min max value where fuel level is between min and max
    const min = readings.reduce((prev, current) => (prev.sensor_readings < current.sensor_readings) ? prev : current);
    const max = readings.reduce((prev, current) => (prev.sensor_readings > current.sensor_readings) ? prev : current);
    const value = (fuel_level - min.sensor_readings) * (max.litres - min.litres) / (max.sensor_readings - min.sensor_readings) + min.litres;
    return value;


}

