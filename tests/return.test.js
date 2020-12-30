const request = require('supertest')
const config = require('../server')
const db = config.db

beforeAll(() => {
  db.migrate.latest()
})

beforeEach(() => {
  db('loans').del().then()
  db('book').del().then()
  db('user').del().then()
});

afterAll(() => {
  db('loans').del().then()
  db('book').del().then()
  db('user').del().then()
});

describe('PUT/book/return', () => {
  it('Livro não informado', async () => {
    const res = await request(config)
      .put('/book/return')
      .send({
        logged_user_id: 1,
      	book_id: '',
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Usuário logado não informado', async () => {
    const res = await request(config)
      .put('/book/return')
      .send({
        logged_user_id: '',
      	book_id: 1,
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Usuário não cadastrado', async () => {
    const res = await request(config)
      .put('/book/return')
      .send({
        logged_user_id: 999999999,
      	book_id: 1
      })
    expect(res.statusCode).toEqual(400)
  })
  it('Livro não cadastrado', async () => {
    const res = await request(config)
      .put('/book/return')
      .send({
        logged_user_id: 1,
      	book_id: 99999999999
      })
    expect(res.statusCode).toEqual(400)
  })
})

describe('Return CRUD', () => {
  it('Devolver livro', async () => {
    let res = await request(config)
      .post('/user')
      .send({
        name: 'Beltrano da Silva',
        email: 'beltrano@email.com'
      })
    const idUser1 = res.body.id
    res = await request(config)
      .post('/user')
      .send({
        name: 'Fulano da Silva',
        email: 'fulano@email.com'
      })
    const idUser2 = res.body.id
    res = await request(config)
      .post('/book')
      .send({
        logged_user_id: idUser1,
        title: 'Título informado',
        pages: '123'
      })
    const idBook = res.body.id
    res = await request(config)
      .put('/book/lend')
      .send({
        logged_user_id: idUser1,
        book_id: idBook,
        to_user_id: idUser2
      })  
    const toUserId = res.body.to_user_id
    res = await request(config)
      .put('/book/return')
      .send({
        logged_user_id: toUserId,
        book_id: idBook,
      })      
    expect(res.statusCode).toEqual(200)  

    res = await request(config)
      .put('/book/return')
      .send({
          logged_user_id: toUserId,
          book_id: idBook,
      }) 
    expect(res.statusCode).toEqual(400)       
  })
})