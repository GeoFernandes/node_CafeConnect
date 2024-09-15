import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { createExpressServer } from 'routing-controllers';
import { connectWithRetry } from './src/config/database/database';
import UsuarioController from './src/controllers/usuario/UsuarioController';
import swaggerUi from 'swagger-ui-express';
import { getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'

// Inicializa variáveis de ambiente
dotenv.config();

// Cria o servidor Express
const app = createExpressServer({
  controllers: [UsuarioController],
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gera a especificação OpenAPI (Swagger)
const swaggerSpec = routingControllersToSpec(getMetadataArgsStorage(), {
  routePrefix: '/api',
  // Informações básicas da API
  // info: {
  //   title: 'API CafeConnect',
  //   description: 'Documentação da API CafeConnect',
  //   version: '1.0.0',
  // },
});

// Configura o Swagger UI no Express
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const startServer = () => {
  app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
    console.log('Documentação disponível em: http://localhost:8080/docs');
  });
};

// Conecta ao MongoDB e inicia o servidor
connectWithRetry()
  .then(() => {
    console.log('Conectado ao MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

export default app;
