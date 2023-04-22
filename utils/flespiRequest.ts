
import axios from 'axios';

// create an axios get request to flespi

export requestToflespi = async ( channelId : string) => {

    
 const flespiRequest = axios.create({
    baseURL: 'https://flespi.io/gw/channels/1156612/messages',
    method: 'get',
    headers: {
        Authorization: `Token ${process.env.FLESPI_TOKEN}`
    }
  });

    }
