
import axios from 'axios';

// create an axios get request to flespi

const sendRequestToFlespi = async (channel: string, lastTimeStamp: number) => {
  const url = `https://flespi.io/gw/channels/${channel}/messages`;
  return  await axios
    .get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `FlespiToken ${process.env.FLESPI_TOKEN}`,
      },
    })
    .then((res) => {
      let data = []
     // filter response data by timestamp 12  + 5*60*1000
     
     const pas = 1
      const increment = (lastTimeStamp + pas*60)
      console.log('avant', lastTimeStamp);
      if(res.data['result']) {
         data = res.data.result.filter((item) => item['server.timestamp'] >= increment);
         console.log('ici', data.length)
      }
      else data = res.data['result']
       
      console.log('apres', increment)
      return  data;
    })
    .catch((e) => {
    console.log(url)
      console.error({ message: e.message, service: 'flespi' });
    });
};

export default sendRequestToFlespi;
