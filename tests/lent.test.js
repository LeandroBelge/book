const request = require("supertest");
const config = require('../server')
const db = config.db

beforeAll(() => {
  db.migrate.latest()
  db('loans').del().then()
});

afterAll(() => {
  db('loans').del().then()
  db('user').del().then()
  db('book').del().then()
});
