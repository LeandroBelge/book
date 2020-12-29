# Book
Api contendo serviços de empréstimos e devoluções de livros. 
## Requisitos

- PostgreSQL
- Node 12.14

## Setup

1. Clonar ou baixar o repositório, entrar na raíz da aplicação e executar o comando abaixo.
```
npm install
```

2. Rodar o script de criação dos bancos de produção e teste que fica na pasta raíz da aplicação.

```
node createDatabse
```

3. O arquivo .env contém as configurações dos bancos de dados

4. Quando o serviço for iniciado, caso não seja informada uma porta (PORT) como variável de ambiente, o serviço será executado na porta 8080.

### Commandos Makefile

Iniciar o serviço em modo de desenvolvimento com nodemon:

```
npm start
```

Iniciar o serviço em modo de produção com pm2:

```
npm run prod
```

Efetuar testes:

```
npm run test ou npm run watch
```
