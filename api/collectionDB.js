module.exports = app => {
    async function saveBook(book) {
        const res = await app.db('book')
            .returning(['id', 'created_at'])
            .insert(book)

        book.id = res[0].id
        book.created_at = res[0].created_at
        return book
    }

    async function saveLendBook(loans) {
        const res = await app.db('loans')
            .returning(['lent_at', 'returned_at'])
            .insert(loans)

        loans.lent_at = res[0].lent_at
        loans.returned_at = res[0].returned_at
        return loans        
    }

    async function saveReturnBook(loans) {
        const res = await app.db('loans')
            .returning(['id','book_id', 'from_user_id', 'to_user_id', 'lent_at', 'returned_at'])
            .update(loans)
            .where({id: loans.id})
        return res[0]
    }

    return { saveBook, saveLendBook, saveReturnBook }
}