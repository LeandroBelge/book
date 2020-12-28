const { db, dbTest } = require('./.env')

module.exports = { 
	client: 'postgresql',
	connection: process.env.NODE_ENV === 'test' ? dbTest : db,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	} 
}
