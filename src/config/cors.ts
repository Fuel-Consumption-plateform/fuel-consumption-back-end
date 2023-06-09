const { HOST_IP = 'localhost' } = process.env;

const corsOptions = {
  origin: [],
  credentials: true,
};

const hosts = [
  'flespi.com',
  'localhost:3000',
  '127.0.0.1:3000',
  'd1r4ce9f3jo5h1.cloudfront.net',
  'backend.odyssey-tec.com',
  'cpanel.odyssey-tec.com',
  'localhost',
  `${HOST_IP}:3000`,
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
