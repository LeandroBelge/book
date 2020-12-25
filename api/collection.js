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
            .insert(book)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    }
    function lendBook(){

    } 
    function returnBook() {

    }

    return { addBookToMyCollection, lendBook, returnBook }
}