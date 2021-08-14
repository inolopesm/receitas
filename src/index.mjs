'use strict';

import express from 'express'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'

/**
 * @typedef {Object} IRecipe
 * @property {string} id
 * @property {string} title
 * @property {string} mealType
 * @property {number} numberOfPeopleItServes
 * @property {string} difficultyLevel
 * @property {string} listOfIngredients
 * @property {string} preparationSteps
 * @property {string} createdAt
 */

/**
 * @typedef {Object} IRecipeConstructor
 * @property {string|undefined} id
 * @property {string} title
 * @property {string} mealType
 * @property {number} numberOfPeopleItServes
 * @property {string} difficultyLevel
 * @property {string} listOfIngredients
 * @property {string} preparationSteps
 * @property {string|undefined} createdAt
 */

 class Recipe {
    /**
     * Método responsável por criar uma receita
     * @param {IRecipeConstructor} params
     */
    constructor({ id = uuid(), title, mealType, numberOfPeopleItServes, difficultyLevel, listOfIngredients, preparationSteps, createdAt = new Date().toISOString() }) {
        this.id                     = id
        this.title                  = title
        this.mealType               = mealType
        this.numberOfPeopleItServes = numberOfPeopleItServes
        this.difficultyLevel        = difficultyLevel
        this.listOfIngredients      = listOfIngredients
        this.preparationSteps       = preparationSteps
        this.createdAt              = createdAt
    }

    /**
     * Método responsável por retornar um objeto simples da classe
     * @return {IRecipe}
     */
    toJSON() {
        return {
            id                      : this.id,
            title                   : this.title,
            mealType                : this.mealType,
            numberOfPeopleItServes  : this.numberOfPeopleItServes,
            difficultyLevel         : this.difficultyLevel,
            listOfIngredients       : this.listOfIngredients,
            preparationSteps        : this.preparationSteps,
            createdAt               : this.createdAt
        }
    }
}

/**
 * Método responsável por buscar as receitas na persistência
 * @returns {Promise<Recipe[]>}
 */
async function getRecipes() {
    const fileContent = await fs.readFile('./src/data/recipes.json')
    const fileData = fileContent.toString()

    /** @type {IRecipe[]} */
    const recipeObjects = JSON.parse(fileData)

    return recipeObjects.map(object => new Recipe(object))
}

/**
 * Método responsável por salvar as receitas na persistência
 * @param {Recipe[]} recipes
 * @returns {Promise<void>}
 */
async function saveRecipes(recipes) {
    const fileData = JSON.stringify(recipes, null, 4)
    await fs.writeFile('./src/data/recipes.json', fileData)
}

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.urlencoded({ extended: false }))

app.get('/', async (request, response) => {
    const recipes = await getRecipes()
    return response.render('index', { recipes })
})

app.get('/create', (request, response) => {    
    return response.render('create')
})

app.post('/create', async (request, response) => {
    request.body.numberOfPeopleItServes = Number.parseInt(request.body.numberOfPeopleItServes)
    const recipe = new Recipe({
        title                   : request.body.title,
        mealType                : request.body.mealType,
        numberOfPeopleItServes  : Number.parseInt(request.body.numberOfPeopleItServes),
        difficultyLevel         : request.body.difficultyLevel,
        listOfIngredients       : request.body.listOfIngredients,
        preparationSteps        : request.body.preparationSteps
    })

    const recipes = await getRecipes()
    recipes.push(recipe)
    await saveRecipes(recipes)

    return response.redirect('/')
})

app.get('/:id', async (request, response) => {
    const { id } = request.params
    const recipes = await getRecipes()
    const recipe = recipes.find(recipe => recipe.id === id)
    if (recipe === undefined) return response.status(404).end()
    return response.render('detail', { recipe })
})

app.listen(3000)
