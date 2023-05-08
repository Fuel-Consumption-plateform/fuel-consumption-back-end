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
  'localhost:4000',
  '3.21.73.82:4200',
  'd1r4ce9f3jo5h1.cloudfront.net',
  'helios.chida-app.com.s3-website.us-east-2.amazonaws.com',
  'helios.chida-app.com.s3-website.us-east-2.amazonaws.com:4000',
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