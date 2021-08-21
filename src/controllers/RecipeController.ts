import { RequestHandler } from 'express'
import Recipe from '../models/Recipe'
import RecipeRepository from '../repositories/RecipeRepository'
import StoreRecipeValidator from '../validators/StoreRecipeValidator'

export default class RecipeController {
  index: RequestHandler = async (request, response) => {
    const recipes = await RecipeRepository.getAll()

    if (request.query.search === undefined) {
      return response.render('index', { recipes, title: '' })
    }

    const partialTitle = String(request.query.search)
    const matchedRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(partialTitle))
    return response.render('index', { recipes: matchedRecipes, title: partialTitle })
  }

  show: RequestHandler = async (request, response) => {
    const { id } = request.params
    const recipes = await RecipeRepository.getAll()
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

    const error = StoreRecipeValidator.validate(recipe)

    if (error !== null) {
      return response.redirect(`/create?error=${error.message}`)
    }

    await RecipeRepository.save(recipe)

    return response.redirect('/')
  }
}
