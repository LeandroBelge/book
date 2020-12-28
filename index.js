const app = require('./server')

app.listen(process.env.PORT || 8080, () => {
    console.log('Backend executando na porta 8080...')
})


