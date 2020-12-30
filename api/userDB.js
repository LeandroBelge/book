module.exports = app => {
    
    async function save(user) {
        const res = await app.db('user')
            .returning(['id', 'created_at'])
            .insert(user)
            .catch(err => { throw err })

        user.id = res[0].id
        user.created_at = res[0].created_at
        user.collection = []
        user.lent_books = []
        user.borrowed_books = []
        return user
    }

    async function get(id) {
        let res = await app.db('user')
                    .select('id', 'name', 'email')
                    .where({ id: id })
                    .first()
        if (!res) {
            throw "Usuário não encontrado"
        }
        
        let user = res

        res = await app.db('book')
                .select()
                .where({logged_user_id: user.id})
                    
        user.collection = res

        res = await app.db('loans')
                .select()
                .where({from_user_id: user.id})
        
        user.lent_books = res

        res = await app.db('loans')
                .select()
                .where({to_user_id: user.id})
        
        user.borrowed_books = res 
                                    
        return user
    }

    return {save, get}
}