const {createdb} = require('pgtools');
const { db, dbTest } = require('./.env')

var config = {
  host: db.host,
  user: db.user,
  password: db.password,
  port: db.port
}
var configTest = {
  host: dbTest.host,
  user: dbTest.user,
  password: dbTest.password,
  port: dbTest.port
}

const nameDB = db.database
const nameDbTest = dbTest.database

createdb(config, nameDB, function (err, res) {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(`Banco de dados ${nameDB} criado com sucesso!`)
})
createdb(configTest, nameDbTest, function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log(`Banco de dados ${nameDbTest} criado com sucesso!`)
})
