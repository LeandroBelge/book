module.exports = app => {
    const { existsOrError, notExistsOrError} = app.api.validation
    
    const addBookToMyCollection = async (req, res) => {
        const book = { ...req.body }
        
        try {
            existsOrError(book.logged_user_id, 'Proprietário não informado')
            existsOrError(book.title, 'Título não informado')
            existsOrError(book.pages, 'Número de páginas não informado')
            const bookFromDB = await app.db('book')
                .where({ title: book.title,  logged_user_id: book.logged_user_id}).first()
            if(bookFromDB) {
                notExistsOrError(bookFromDB, 'Livro já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
        
        app.db('book')
            .returning(['id', 'created_at'])
            .insert(book)
            .then(bookTemp => {
                book.id = bookTemp[0].id
                book.created_at = bookTemp[0].created_at
                res.json(book)
            })
            .catch(err => res.status(500).send(err))

    }

    const lendBook = async (req, res) => {
        const lendBook = { ...req.body }
        
        try {
            existsOrError(lendBook.book_id, 'Livro não informado')
            existsOrError(lendBook.logged_user_id, 'Proprietário não informado')
            existsOrError(lendBook.to_user_id, 'Requerente não informado')
            if (lendBook.logged_user_id === lendBook.to_user_id) { throw 'Não é possível realizar empréstimo para si próprio'}
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
        } catch(msg) {
            return res.status(400).send(msg)
        }
        let loans = {
            book_id: lendBook.book_id,
            from_user_id: lendBook.logged_user_id,
            to_user_id: lendBook.to_user_id
        }
        app.db('loans')
            .returning(['lent_at', 'returned_at'])
            .insert(loans)
            .then(loansTemp => {
                loans.lent_at = loansTemp[0].lent_at
                loans.returned_at = loansTemp[0].returned_at
                res.json(loans)
            })
            .catch(err => res.status(500).send(err))
    }

    const returnBook = async(req, res) => {
        const returnBook = {...req.body}
        try {
            existsOrError(returnBook.book_id, 'Livro não informado')
            existsOrError(returnBook.logged_user_id, 'Usuário não informado')
            
            //Validar se o livro pode ser emprestado
            const releasedBookDB = await app.db('loans')
                .where({
                    book_id: returnBook.book_id,
                    to_user_id: returnBook.logged_user_id
                })
                .whereNotNull('lent_at')
                .whereNull('returned_at')
                .first()
            if(!releasedBookDB) {
                throw 'O Livro não pode ser devolvido pois não foi emprestado'
            }
            let loans = {
                id: releasedBookDB.id,
                returned_at: app.api.common.getDateTimeNowPostgres()
            }
            app.db('loans')
                .returning(['id','book_id', 'from_user_id', 'to_user_id', 'lent_at', 'returned_at'])
                .update(loans)
                .where({id: loans.id})
                .then(loansTemp => res.json(loansTemp[0]))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }              
    }

    return { addBookToMyCollection, lendBook, returnBook }
}