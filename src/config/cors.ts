const { HOST_IP = 'localhost' } = process.env;

const corsOptions = {
  origin: [],
  credentials: true
};

const hosts = [
  'flespi.com',
  'localhost:3000',
  'localhost:3001',
  'localhost:3002',
  '127.0.0.1:4000',
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3002',
  'localhost:4000',
  'd1r4ce9f3jo5h1.cloudfront.net',
  'helios.chida-app.com.s3-website.us-east-2.amazonaws.com',
  'localhost',
  `${HOST_IP}:3000`,
  `${HOST_IP}:3001`,
  `${HOST_IP}:3002`,
  `${HOST_IP}:4200`,
  `${HOST_IP}:4000`,
  `${HOST_IP}:5200`,
  HOST_IP
];

hosts.forEach(host => {
  corsOptions.origin.push(`http://${host}`);
  corsOptions.origin.push(`https://${host}`);
  if (/.com$/.test(host)) {
    corsOptions.origin.push(`http://www.${host}`);
    corsOptions.origin.push(`https://www.${host}`);
  }
});

export default corsOptions;