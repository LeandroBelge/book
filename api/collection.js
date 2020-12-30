module.exports = app => {
    const { bookIsValid, lendIsValid, returnIsValid } = app.api.collectionValidation

    const addBookToMyCollection = async (req, res) => {
        let book = { ...req.body }
        try {
            await bookIsValid(book)
        } catch(msg) {
            return res.status(400).send(msg)
        }
        const { saveBook } = app.api.collectionDB
        try {
           book = await saveBook(book)
           res.json(book)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const lendBook = async (req, res) => {
        const lendBook = { ...req.body }
        try {
            await lendIsValid(lendBook)
        } catch(msg) {
            return res.status(400).send(msg)
        }
        let loans = {
            book_id: lendBook.book_id,
            from_user_id: lendBook.logged_user_id,
            to_user_id: lendBook.to_user_id
        }
        const { saveLendBook } = app.api.collectionDB
        try {
            loans = await saveLendBook(loans)
            res.json(loans)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const returnBook = async(req, res) => {
        const returnBook = {...req.body}
        try {
            await returnIsValid(returnBook)
        } catch(msg) {
            return res.status(400).send(msg)
        }             
        const { saveReturnBook, getLoansToUser } = app.api.collectionDB
        
        let loans = await getLoansToUser(returnBook.logged_user_id, returnBook.book_id)
        try {
            loans = await saveReturnBook(loans)
            res.json(loans)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    return { addBookToMyCollection, lendBook, returnBook }
}