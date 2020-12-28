const request = require("supertest");
const config = require('../server')
const db = config.db

beforeAll(() => {
  db.migrate.latest()
  db('book').del().then()
});

afterAll(() => {
  db('book').del().then()
  //Remover o usuário cadastrado para teste de livro
  db('user').del().then()
});

describe("POST/book", () => {
  it ('Livro sem proprietário', async () => {
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: '',
        title: 'Título informado',
        pages: 1
      })

    expect(res.statusCode).toEqual(400)
  }) 
  it ('Livro sem título', async () => {
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: '1',
        title: '',
        pages: 1
      })

    expect(res.statusCode).toEqual(400)
  }) 
  it ('Livro sem número de páginas', async () => {
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: '1',
        title: 'Título informado',
        pages: ''
      })

    expect(res.statusCode).toEqual(400)
  }) 
});

describe('Book CRUD', () => {
  let id = 0
  it('Criar usuário', async () => {
    const res = await request(config)
      .post('/user')
      .send({
        name: 'Fulano da Silva',
        email: 'fulano@email.com'
      })
    id = res.body.id  
  })
  it ('', async () => {      
    const res = await request(config)
      .post('/book')
      .send({
        logged_user_id: id,
        title: 'Título informado',
        pages: '123'
      })
    expect(res.statusCode).toEqual(200)
  })  
})