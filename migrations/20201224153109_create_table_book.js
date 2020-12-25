
exports.up = function(knex, Promise) {
    return knex.schema.createTable('book', table => {
        table.increments('id').primary()
        table.integer('logged_user_id').references('id')
            .inTable('user').notNull()
        table.string('title').notNull()
        table.integer('pages').notNull()
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('book')
};
