import express from 'express'
import recipes from './data/recipes.json'

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.get('/', (request, response) => {
    return response.render('index', { recipes })
})

app.listen(3000)
