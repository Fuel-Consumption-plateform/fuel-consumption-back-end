
const {
    JWT_SECRET = 'e7b579900232f3b6ccb7ed7d7bbd492b',
    // KECCEL_TOKEN = 'WQ45K6GP24ZM4FG',
    MAIL_PASS,
    MAIL_USER,
    MONGO_DB_CONNECTION = 'mongodb://127.0.0.1:27017/fuelComsuptionDB',
    NODE_ENV,
    NODE_PORT = 3000,
    OTP_SMS_ORIGIN,
    PWD,
  } = process.env;


const appConstants = {
    secret: JWT_SECRET,
    prod: NODE_ENV === 'production',
    local: NODE_ENV === 'local',
    nodePort: +NODE_PORT,
    // keccel: {
    //   from: 'KUMBA',
    //   token: KECCEL_TOKEN
    // },
    mail: {
      main: {
        user: MAIL_USER,
        pass: MAIL_PASS
      }
    },
    mongoUrl: MONGO_DB_CONNECTION,
    // CLOUDINARY : 'Cloudinary',
    // Default_url: 'https://res.cloudinary.com/kumbabusiness/image/upload/v1675931990/profile-icon-design-free-vector_llwoqn.jpg'
   
  };

  export default appConstants;