import { MongooseModuleOptions } from '@nestjs/mongoose';

const mongooseModuleOptions: MongooseModuleOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  retryDelay: 1000,
  retryAttempts: 1,
  connectionFactory: async (connection) => {
    const { host, port, name } = await connection;
    console.log(`MongoDB connected via ${host}:${port}/${name}`);
    return connection;
  },
};

export default mongooseModuleOptions;
