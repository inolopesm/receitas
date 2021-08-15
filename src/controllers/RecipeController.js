import Recipe from '../models/Recipe.js'

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

export default class RecipeController {
    /**
     * Método responsável por renderizar uma lista de receitas
     * @type {RequestHandler}
     */
    index = async (request, response) => {
        const recipes = await Recipe.getAll()
        return response.render('index', { recipes })
    }

    /**
     * Método responsável por renderizar uma receita
     * @type {RequestHandler}
     */
    show = async (request, response) => {
        const { id } = request.params
        const recipes = await Recipe.getAll()
        const recipe = recipes.find(recipe => recipe.id === id)
        if (recipe === undefined) return response.status(404).end()
        return response.render('detail', { recipe })
    }

    /**
     * Método responsável por renderizar um formulário para criar uma receita
     * @type {RequestHandler}
     */
    create = (request, response) => {    
        return response.render('create')
    }

    /**
     * Método responsável por guardar uma nova receita
     * @type {RequestHandler}
     */
    store = async (request, response) => {
        const recipe = new Recipe({
            title                   : request.body.title,
            mealType                : request.body.mealType,
            numberOfPeopleItServes  : Number.parseInt(request.body.numberOfPeopleItServes),
            difficultyLevel         : request.body.difficultyLevel,
            listOfIngredients       : request.body.listOfIngredients,
            preparationSteps        : request.body.preparationSteps
        })

        await recipe.save()

        return response.redirect('/')
    }
}
