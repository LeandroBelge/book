module.exports = app => {
    const {isValid} = app.api.userValidation
    //CreateUser
    const createUser = async (req, res) => {
        let user = { ...req.body }
        try {
            await isValid(user)                        
        } catch(msg) {
            return res.status(400).send(msg)
        }
        const { save } = app.api.userDB
        try {
            user = await save(user)
            res.json(user)
        } catch (error) {
            res.status(500).send(error)
        }
    }
    
    //GetUser
    const getUser = async (req, res) => {
        const id = req.params.id
        const { get } = app.api.userDB
        try {
            const user = await get(id)
            res.json(user)
        } catch (error) {
            res.status(404).send(error)
        }
    }

    return { createUser, getUser }
}