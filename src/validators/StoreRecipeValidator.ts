import * as uuid from 'uuid'
import Recipe from '../models/Recipe'

export default class StoreRecipeValidator {
  static validate(recipe: Recipe): Error | null {
    if (!uuid.validate(recipe.id)) {
      return new Error('id possui um uuid inválido')
    }

    if (typeof recipe.title !== 'string') {
      return new Error('title deve ser uma string')
    }

    if (recipe.title === '') {
      return new Error('title não pode estar vazio')
    }

    if (!['café da manhã', 'almoço', 'lanche', 'jantar'].includes(recipe.mealType)) {
      return new Error('mealType não está incluso na lista de possíveis valores')
    }

    if (typeof recipe.numberOfPeopleItServes !== 'number') {
      return new Error('numberOfPeopleItServes deve ser um number')
    }

    if (!Number.isSafeInteger(recipe.numberOfPeopleItServes)) {
      return new Error('numberOfPeopleItServes deve ser um inteiro válido')
    }

    if (recipe.numberOfPeopleItServes <= 0) {
      return new Error('numberOfPeopleItServes deve ser maior que zero')
    }

    if (!['iniciante', 'intermediário', 'avançado'].includes(recipe.difficultyLevel)) {
      return new Error('difficultyLevel não está incluso na lista de possíveis valores')
    }

    if (typeof recipe.listOfIngredients !== 'string') {
      return new Error('listOfIngredients deve ser uma string')
    }

    if (recipe.listOfIngredients === '') {
      return new Error('listOfIngredients não pode estar vazio')
    }

    if (typeof recipe.preparationSteps !== 'string') {
      return new Error('preparationSteps deve ser uma string')
    }

    if (recipe.preparationSteps === '') {
      return new Error('preparationSteps não pode estar vazio')
    }

    try {
      new URL(recipe.photoUrl)
    } catch (error) {
      return new Error('photoUrl é uma url inválida')
    }

    if (typeof recipe.createdAt !== 'string') {
      return new Error('createdAt deve ser uma string')
    }

    if (new Date(recipe.createdAt).toString() === 'Invalid Date' || isNaN(Date.parse(recipe.createdAt))) {
      return new Error('createdAt deve ser uma data válida')
    }

    return null
  }
}
