module.exports = app => {
    app.route('/user')
        .post(app.api.user.createUser)
    app.route('/user/:id')
        .get(app.api.user.getUser)

    app.route('/book')
        .post(app.api.collection.addBookToMyCollection)
    
    app.route('/book/lend')
        .put(app.api.collection.lendBook)
    
    app.route('/book/return')
        .put(app.api.collection.returnBook)
}