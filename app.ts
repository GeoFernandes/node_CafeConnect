import PagamentoController from './src/controllers/pagamento/pagamentoController';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { connectWithRetry } from './src/config/database/database';
import ProdutoController from './src/controllers/produto/produtoController';
import UsuarioController from './src/controllers/usuario/usuarioController';
import CarrinhoController from './src/controllers/carrinho/carrinhoControler';
import PedidoController from './src/controllers/pedido/pedidoController';
import { authorizationChecker, currentUserChecker } from './src/autenticacao/authorization';
import { iniciarTarefasAgendadas } from './src/cron';

// Inicializa variáveis de ambiente
dotenv.config();

// Configura o CORS para liberar a origem específica do frontend
const app = createExpressServer({
  controllers: [UsuarioController, ProdutoController, CarrinhoController, PagamentoController, PedidoController],
  authorizationChecker,
  currentUserChecker,
  cors: {
    origin: 'https://cafeconnect-theta.vercel.app', // Permitir o front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Se usar cookies ou autenticação via sessão
  },
});

// Aplica o middleware CORS antes das rotas
app.use(cors({
  origin: 'https://cafeconnect-theta.vercel.app',
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
    iniciarTarefasAgendadas();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

export default app;