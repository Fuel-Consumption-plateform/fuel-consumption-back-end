
import axios from 'axios';

// create an axios get request to flespi

const sendRequestToFlespi = async (channel: string, lastTimeStamp) => {
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
     // filter response data by timestamp
      if(res.data.length > 0)  data = res.data.filter((item) => item.server.timestamp >= lastTimeStamp);
      else data = res.data
     
      return  data;
    })
    .catch((e) => {
    console.log(url)
      console.error({ message: e.message, service: 'flespi' });
    });
};

export default sendRequestToFlespi;
