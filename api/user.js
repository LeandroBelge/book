const { json } = require("body-parser")

module.exports = app => {
    const { existsOrError, notExistsOrError, isEmail} = app.api.validation

    //CreateUser
    const createUser = async (req, res) => {
        const user = { ...req.body }
        
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            isEmail(user.email, 'E-mail inválido')
            const userFromDB = await app.db('user')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'E-mail já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
        
        app.db('user')
            .returning(['id', 'created_at'])
            .insert(user)
            .then(resp => {
                user.id = resp[0].id
                user.created_at = resp[0].created_at
                user.collection = []
                user.lent_books = []
                user.borrowed_books = []
                res.json(user)
            })
            .catch(err => res.status(500).send(err))
    }
    
    //GetUser
    const getUser = (req, res) => {
        app.db('user')
            .select('id', 'name', 'email')
            .where({ id: req.params.id })
            .first()
            .then(user => {
                app.db('book')
                    .select()
                    .where({logged_user_id: user.id})
                    .then(books => {
                        user.collection = books
                        app.db('loans')
                            .select()
                            .where({from_user_id: user.id})
                            .then(loans => {
                                user.lent_books = loans
                                app.db('loans')
                                    .select()
                                    .where({to_user_id: user.id})
                                    .then(borrowed => {
                                        user.borrowed_books = borrowed
                                        res.json(user)
                                    })
                            })
                    })
            })
            .catch(err => {
                res.status(404).send("Usuário não encontrado")
            })
    }

    return { createUser, getUser }
}