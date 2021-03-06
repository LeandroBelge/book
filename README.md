# Book
A Api book contém serviços de empréstimos e devoluções de livros. Ela deverá proporcionar:
 - Cadastrar um usuário.
 - Recuperar dados de um usuário.
 - Cadastrar um livro para um usuário.
 - Empréstimos de livros entre os usuários.
 - Devolução dos livros emprestados.

## Requisitos

- PostgreSQL
- Node 12.14

## Setup

1. Clonar ou baixar o repositório, entrar na raíz da aplicação e executar o comando abaixo.
```
npm install
```

2. Rodar o script createDatabse.js para criação dos bancos book e book_test.

```
node createDatabase
```

3. O arquivo .env contém as configurações dos bancos de dados, caso seja necessário alguma modificação de porta ou outra variável de configuração.

4. Quando o serviço for iniciado ele deverá rodar na porta 8080, caso a variável de ambiente PORT não seja setada. 

```
npm run prod 
```

5. Inciando o serviço no ambiente de desenvolvimento e utilizando o banco de book_test.
```
npm start 
```

6. Efetuando os testes de integração e unitários.

```
npm run test
```
