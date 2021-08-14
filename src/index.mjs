import express from 'express'
import recipes from './data/recipes.json'

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.get('/', (request, response) => {
    return response.render('index', { recipes })
})

app.get('/create', (request, response) => {
    return response.render('create')
})

app.get('/:id', (request, response) => {
    const { id } = request.params
    const recipe = recipes.find(recipe => recipe.id === id)
    if (recipe === undefined) return response.status(404).end()
    return response.render('detail', { recipe })
})

app.listen(3000)
