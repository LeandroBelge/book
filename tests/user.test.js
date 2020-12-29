const request = require("supertest");
const config = require('../server')
const db = config.db

beforeAll(() => {
  db.migrate.latest()
  db('user').del().then()
  console.log('passou aqui')
});

afterAll(() => {
  db('user').del().then()
});


describe("POST/user", () => {
  it('Usuário sem nome', async () => {
    const res = await request(config)
      .post('/user')
      .send({
        name: '',
        email: 'fulano@email.com'
      })

    expect(res.statusCode).toEqual(400)
  })
  it('Usuário sem email', async () => {
    const res = await request(config)
      .post('/user')
      .send({
        name: 'Fulano da Silva',
        email: ''
      })

    expect(res.statusCode).toEqual(400)
  })
  it('Usuário com e-mail inválido', async () => {
    const res = await request(config)
      .post('/user')
      .send({
        name: 'Fulano da Silva',
        email: 'fulano.com'
      })

    expect(res.statusCode).toEqual(400)
  })
});

describe("GET/user/{id}", () => {
  it('Usuário não encontrado', async () => {
    const res = await request(config).get('/user/0')
    expect(res.statusCode).toEqual(404)
  })
  it('Parâmetro  inválido', async () => {
    const res = await request(config).get('/user/teste')
    expect(res.statusCode).toEqual(404)
  })
});

describe("User CRUD", () => {
  it('Criar usuário', async () => {
    const res = await request(config)
      .post('/user')
      .send({
        id: 1,
        name: 'Fulano da Silva',
        email: 'fulano@email.com'
      }) 
    expect(res.statusCode).toEqual(200)
  })  
  it('Recuperando usuário', async () => {
    const res = await request(config).get(`/user/1`)
    expect(res.statusCode).toEqual(200)
  })
})

describe("Usuário duplicado", () => {
  it('Email já cadastrado', async () => {
    const res = await request(config)
       .post('/user')
       .send({
         name: 'Fulano da Silva',
         email: 'fulano@email.com'
       })
     expect(res.statusCode).toEqual(400)
  })
})
