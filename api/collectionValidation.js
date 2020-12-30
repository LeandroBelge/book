module.exports = app => {
    const { existsOrError, notExistsOrError} = app.api.validation
    async function bookIsValid(book) {
        existsOrError(book.logged_user_id, 'Proprietário não informado')
        existsOrError(book.title, 'Título não informado')
        existsOrError(book.pages, 'Número de páginas não informado')
        const userFromDB = await app.db('user')
            .where({ id: book.logged_user_id})
            .first()
        if(!userFromDB) {
            throw 'Usuário não cadastrado'
        }
        const bookFromDB = await app.db('book')
            .where({ title: book.title,  logged_user_id: book.logged_user_id})
            .first()
        if(bookFromDB) {
            notExistsOrError(bookFromDB, 'Livro já cadastrado')
        }
    } 
    async function lendIsValid(lendBook) {
        existsOrError(lendBook.book_id, 'Livro não informado')
        existsOrError(lendBook.logged_user_id, 'Proprietário não informado')
        existsOrError(lendBook.to_user_id, 'Requerente não informado')
        const userFromDB = await app.db('user')
            .where({id: lendBook.logged_user_id, id: lendBook.to_user_id})
            .first()
        if(!userFromDB) {
            throw 'Não foi possível realizar o empréstimo'
        }
        if (lendBook.logged_user_id === lendBook.to_user_id) { throw 'Não é possível realizar empréstimo para si próprio'}
        const bookNotFound = await app.db('book')
            .where({
                id: lendBook.book_id
            }).first()
        
        if(!bookNotFound) {
            throw 'O Livro informado não está cadastrado'
        }
        //Validar se o livro pertence ao usuário logado
        const bookNotFromUser = await app.db('book')
            .where({
                id: lendBook.book_id,
                logged_user_id: lendBook.logged_user_id
            }).first()
        
        if(!bookNotFromUser) {
            throw 'O Livro não pertence ao usuário'
        }
        //Validar se o livro pode ser emprestado
        const releasedBookDB = await app.db('loans')
            .where({
                book_id: lendBook.book_id,
                from_user_id: lendBook.logged_user_id
            })
            .whereNotNull('lent_at')
            .whereNull('returned_at')
            .first()
        if(releasedBookDB) {
            throw 'O Livro não pode ser emprestado'
        }
    } 
    async function returnIsValid(returnBook) {
        existsOrError(returnBook.book_id, 'Livro não informado')
        existsOrError(returnBook.logged_user_id, 'Usuário não informado')
        
        const userFromDB = await app.db('user')
            .where({id: returnBook.logged_user_id})
            .first()
        if(!userFromDB) {
            throw 'Usuário inexistente'
        }
        
        const bookNotFound = await app.db('book')
            .where({
                id: returnBook.book_id
            }).first()
        
        if(!bookNotFound) {
            throw 'O Livro informado não está cadastrado'
        }
        
        //Validar se o livro pode ser devolvido
        const releasedBookDB = await app.db('loans')
            .where({
                book_id: returnBook.book_id,
                to_user_id: returnBook.logged_user_id
            })
            .whereNotNull('lent_at')
            .whereNull('returned_at')
            .first()
        if(!releasedBookDB) {
            throw 'O Livro não pode ser devolvido pois não foi emprestado para o usuário'
        }
    }

    return {bookIsValid, lendIsValid, returnIsValid}
}