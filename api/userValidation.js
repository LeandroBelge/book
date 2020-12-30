module.exports = app => {
    const { existsOrError, notExistsOrError, isEmail} = app.api.validation
    
    async function isValid(user){
        existsOrError(user.name, 'Nome não informado')
        existsOrError(user.email, 'E-mail não informado')
        isEmail(user.email, 'E-mail inválido')
        const userFromDB = await app.db('user')
            .where({ email: user.email })
            .first()
        if(!user.id) {
            notExistsOrError(userFromDB, 'E-mail já cadastrado')
        }
    }

    return { isValid }
}