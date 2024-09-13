import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbOptions = process.env.DB_OPTIONS;

const mongoUri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?${dbOptions}`;

export const connectWithRetry = (): Promise<void> => {
  return mongoose.connect(mongoUri)
    .then(() => {
      console.log(`Conectado ao banco de dados ${dbName}`);
    })
    .catch((err) => {
      console.error('Erro ao conectar ao banco de dados, tentando novamente em 5 segundos', err.message);
      return new Promise<void>((resolve) => setTimeout(() => connectWithRetry().then(resolve), 5000));
    });
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose erro de conexão:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado do MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose desconectado devido ao encerramento da aplicação');
  process.exit(0);
});
