const request = require("supertest");
const config = require('../server')
const faker = require('faker');
const { fake } = require("faker");
const db = config.db

beforeEach(() => {
  db('book').del().then()
  db('user').del().then()
})

afterAll(() => {
  db('book').del().then()
  db('user').del().then()
});

describe("POST/book", () => {
  it ('Livro sem proprietário', async () => {
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: '',
        title: faker.name.title(),
        pages: faker.random.number(1000)
      })

    expect(res.statusCode).toEqual(400)
  }) 
  it ('Livro sem título', async () => {
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: faker.random.number(10),
        title: '',
        pages: faker.random.number(1000)
      })

    expect(res.statusCode).toEqual(400)
  }) 
  it ('Livro sem número de páginas', async () => {
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: faker.random.number(1000),
        title: faker.name.title(),
        pages: ''
      })

    expect(res.statusCode).toEqual(400)
  }) 
});

describe('Book CRUD', () => {
  let id = 0
  it('Adicionar um livro para um usuário', async () => {
    const res = await request(config)
      .post('/user')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email()
      })
    id = res.body.id  
    const resp = await request(config)
      .post('/book')
      .send({
        logged_user_id: id,
        title: faker.name.title(),
        pages: faker.random.number(1000)
      })
    expect(resp.statusCode).toEqual(200)  
  })
})