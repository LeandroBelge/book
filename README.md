# book
Api contendo serviços de empréstimos e devoluções de livros. 
## Requisitos

- PostgreSQL
- Node 12.14


## Setup

1. Clonar ou baixar o repositório e executar o comando.
```
npm install
```

2. Rodar o script de criação dos bancos de produção e teste.

```
node createDatabse
```

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
