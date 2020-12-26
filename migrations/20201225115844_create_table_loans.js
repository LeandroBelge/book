
exports.up = function(knex, Promise) {
    return knex.schema.createTable('loans', table => {
        table.increments('id').primary()
        table.integer('book_id').references('id')
            .inTable('book').notNull()
        table.integer('from_user_id').references('id')
            .inTable('user').notNull()
        table.integer('to_user_id').references('id')
            .inTable('user').notNull()
        table.timestamp('lent_at').defaultTo(knex.fn.now())
        table.timestamp('returned_at')
    })  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('loans')
};
