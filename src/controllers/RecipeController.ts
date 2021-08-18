import { RequestHandler } from 'express'
import Recipe from '../models/Recipe'

export default class RecipeController {
  index: RequestHandler = async (_, response) => {
    const recipes = await Recipe.getAll()
    return response.render('index', { recipes })
  }

  show: RequestHandler = async (request, response) => {
    const { id } = request.params
    const recipes = await Recipe.getAll()
    const recipe = recipes.find(recipe => recipe.id === id)
    if (recipe === undefined) return response.status(404).end()
    return response.render('detail', { recipe })
  }

  create: RequestHandler = (request, response) => {
    const { error = null } = request.query
    return response.render('create', { error })
  }

  store: RequestHandler = async (request, response) => {
    const recipe = new Recipe({
      title: request.body.title,
      mealType: request.body.mealType,
      numberOfPeopleItServes: Number.parseInt(request.body.numberOfPeopleItServes),
      difficultyLevel: request.body.difficultyLevel,
      listOfIngredients: request.body.listOfIngredients,
      preparationSteps: request.body.preparationSteps,
      photoUrl: request.body.photoUrl !== '' ? request.body.photoUrl : undefined
    })

    const error = recipe.isValid()

    if (error !== null) {
      return response.redirect(`/create?error=${error.message}`)
    }

    await recipe.save()

    return response.redirect('/')
  }
}
