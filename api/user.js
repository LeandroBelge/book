module.exports = app => {
    const { existsOrError, notExistsOrError} = app.api.validation

    //CreateUser
    const createUser = async (req, res) => {
        const user = { ...req.body }
        
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            const userFromDB = await app.db('user')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'E-mail já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
        
        app.db('user')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }
    
    //GetUser
    const getUser = (req, res) => {
        app.db('user')
            .select('user.id', 'user.name', 'user.email', 'user.created_at')
            .join('book', 'user.id', 'book.logged_user_id')
            .where({ id: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    return { createUser, getUser }
}