import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { connectWithRetry } from './src/config/database/database';
import ProdutoController from './src/controllers/produto/ProdutoController';
import UsuarioController from './src/controllers/usuario/UsuarioController';

// Inicializa variáveis de ambiente
dotenv.config();

// Configura o CORS para liberar a origem específica do frontend
const app = createExpressServer({
  controllers: [UsuarioController, ProdutoController],
  cors: {
    origin: 'http://localhost:5173', // Permitir o front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Se usar cookies ou autenticação via sessão
  },
});

// Aplica o middleware CORS antes das rotas
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));


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
  app.listen(5002, () => {
    console.log('Servidor rodando na porta 5002');
    console.log('Documentação disponível em: http://localhost:5002/docs');
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