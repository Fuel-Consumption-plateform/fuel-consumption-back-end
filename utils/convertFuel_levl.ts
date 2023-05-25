
// function convert readings value to fuel level

export interface Reading {
    litres: string;
     sensor_readings: string;
}
export function convertFuel_levl(fuel_level: string, readings:  Array<Reading>)
{
    // get interval of readings where fuel_level is in
    // cast readings to number
   const readingsN = readings.map(x => ({litres: parseFloat(x.litres), sensor_readings: parseFloat(x.sensor_readings)})) 
   const fuelN = parseFloat(fuel_level)

  const max =readingsN.filter(x => (x.sensor_readings)>= ((fuelN))) [0]
  const mins = readingsN.filter((x) => (x.sensor_readings) <= (fuelN))
  const min = mins[mins.length-1]
  console.log('max', max)
  console.log('min',min )
  const value = (  fuelN - min.sensor_readings) * ((max.litres - min.litres) / (max.sensor_readings - min.sensor_readings) )+ min.litres;
    return value;


}

