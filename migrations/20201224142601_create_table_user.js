
exports.up = function (knex, Promise) {
    return knex.schema.createTable('user', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user')
};
