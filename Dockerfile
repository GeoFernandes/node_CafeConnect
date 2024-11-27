FROM node:latest

# Define o diretório de trabalho no contêiner
WORKDIR /api

# Copia todos os arquivos do projeto para o contêiner
COPY . .

# Remove a pasta node_modules caso exista (não é necessário se o build for limpo)
RUN rm -rf node_modules

# Instala as dependências do projeto
RUN npm install

# Expõe a porta onde a aplicação será executada
EXPOSE 5002

# Define o comando de inicialização da aplicação
CMD ["npm", "run", "dev"]
