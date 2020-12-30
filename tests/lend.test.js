const request = require('supertest')
const config = require('../server')
const faker = require('faker')
const db = config.db

beforeEach(() => {
  db('loans').del().then()
  db('book').del().then()
  db('user').del().then()
})

afterAll(() => {
  db('loans').del().then()
  db('book').del().then()
  db('user').del().then()
});

describe('PUT/book/lend', () => {
  it('Livro não informado', async () => {
    const res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: faker.random.number(10),
      	book_id: '',
	      to_user_id: faker.random.number(10)
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Usuário logado não informado', async () => {
    const res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: '',
      	book_id: faker.random.number(10),
	      to_user_id: faker.random.number(10)
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Usuário empréstimo não informado', async () => {
    const res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: faker.random.number(10),
      	book_id: faker.random.number(10),
	      to_user_id: ''
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Usuário ou receptor não cadastrados', async () => {
    const res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: faker.random.number(10000),
      	book_id: faker.random.number(10),
	      to_user_id: faker.random.number(10000)
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Livro não cadastrado', async () => {
    const res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: faker.random.number(10),
      	book_id: faker.random.number(10000),
	      to_user_id: faker.random.number(10)
      })
    expect(res.statusCode).toEqual(400)
  })
})

describe('Lend CRUD', () => {
  it('Emprestar livro', async () => {
    let res = await request(config)
      .post('/user')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email()
      })
    const idUser1 = res.body.id
    res = await request(config)
      .post('/user')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email()
      })
    const idUser2 = res.body.id
    res = await request(config)
      .post('/book')
      .send({
        logged_user_id: idUser1,
        title: faker.name.title(),
        pages: faker.random.number(1000)
      })
    const idBook = res.body.id
    res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: idUser1,
        book_id: idBook,
        to_user_id: idUser2
      })  
    expect(res.statusCode).toEqual(200)  
    res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: idUser1,
        book_id: idBook,
        to_user_id: idUser2
      })  
    expect(res.statusCode).toEqual(400)  
  })
})