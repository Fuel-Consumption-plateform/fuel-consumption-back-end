const { HOST_IP = 'localhost' } = process.env;

const corsOptions = {
  origin: [],
  credentials: true,
};

const hosts = [
  'flespi.com',
  'localhost:3000',
  'localhost:3001',
  '3.21.73.82:4200',
  'localhost',
  `${HOST_IP}:3000`,
  `${HOST_IP}:3001`,
  `${HOST_IP}:4200`,
  `${HOST_IP}:5200`,
  HOST_IP,
];

hosts.forEach((host) => {
  corsOptions.origin.push(`http://${host}`);
  corsOptions.origin.push(`https://${host}`);
  if (/.com$/.test(host)) {
    corsOptions.origin.push(`http://www.${host}`);
    corsOptions.origin.push(`https://www.${host}`);
  }
});

export default corsOptions;
