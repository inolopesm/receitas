import fs from 'fs/promises'
import { URL } from 'url'
import * as uuid from 'uuid'

interface IRecipe {
  id: string
  title: string
  mealType: string
  numberOfPeopleItServes: number
  difficultyLevel: string
  listOfIngredients: string
  preparationSteps: string
  photoUrl: string
  createdAt: string
}

type IRecipePartialConstructorKeyParams = 'id' | 'photoUrl' | 'createdAt'

type IRecipeConstructorParams =
  Omit<IRecipe, IRecipePartialConstructorKeyParams>
  & Partial<Pick<IRecipe, IRecipePartialConstructorKeyParams>>


export default class Recipe implements IRecipe {
  id: string
  title: string
  mealType: string
  numberOfPeopleItServes: number
  difficultyLevel: string
  listOfIngredients: string
  preparationSteps: string
  photoUrl: string
  createdAt: string

  constructor(params: IRecipeConstructorParams) {
    this.id = params.id ?? uuid.v4()
    this.title = params.title
    this.mealType = params.mealType
    this.numberOfPeopleItServes = params.numberOfPeopleItServes
    this.difficultyLevel = params.difficultyLevel
    this.listOfIngredients = params.listOfIngredients
    this.preparationSteps = params.preparationSteps
    this.photoUrl = params.photoUrl ?? '/static/images/capa-receita-padrao.png'
    this.createdAt = params.createdAt ?? new Date().toISOString()
  }

  validate(): Error | null {
    if (!uuid.validate(this.id)) {
      return new Error('id possui um uuid inválido')
    }

    if (typeof this.title !== 'string') {
      return new Error('title deve ser uma string')
    }

    if (this.title === '') {
      return new Error('title não pode estar vazio')
    }

    if (!['café da manhã', 'almoço', 'lanche', 'jantar'].includes(this.mealType)) {
      return new Error('mealType não está incluso na lista de possíveis valores')
    }

    if (typeof this.numberOfPeopleItServes !== 'number') {
      return new Error('numberOfPeopleItServes deve ser um number')
    }

    if (!Number.isSafeInteger(this.numberOfPeopleItServes)) {
      return new Error('numberOfPeopleItServes deve ser um inteiro válido')
    }

    if (this.numberOfPeopleItServes <= 0) {
      return new Error('numberOfPeopleItServes deve ser maior que zero')
    }

    if (!['iniciante', 'intermediário', 'avançado'].includes(this.difficultyLevel)) {
      return new Error('difficultyLevel não está incluso na lista de possíveis valores')
    }

    if (typeof this.listOfIngredients !== 'string') {
      return new Error('listOfIngredients deve ser uma string')
    }

    if (this.listOfIngredients === '') {
      return new Error('listOfIngredients não pode estar vazio')
    }

    if (typeof this.preparationSteps !== 'string') {
      return new Error('preparationSteps deve ser uma string')
    }

    if (this.preparationSteps === '') {
      return new Error('preparationSteps não pode estar vazio')
    }

    try {
      new URL(this.photoUrl)
    } catch (error) {
      return new Error('photoUrl é uma url inválida')
    }

    if (typeof this.createdAt !== 'string') {
      return new Error('createdAt deve ser uma string')
    }

    if (new Date(this.createdAt).toString() === 'Invalid Date' || isNaN(Date.parse(this.createdAt))) {
      return new Error('createdAt deve ser uma data válida')
    }

    return null
  }

  async save(): Promise<void> {
    const recipes = await Recipe.getAll()
    const index = recipes.findIndex(recipe => recipe.id === this.id)

    if (index === -1) {
      recipes.push(this)
    } else {
      recipes[index] = this
    }

    const fileData = JSON.stringify(recipes, null, 2)
    await fs.writeFile('./data/recipes.json', fileData)
  }

  static async getAll(): Promise<Recipe[]> {
    const fileContent = await fs.readFile('./data/recipes.json')
    const fileData = fileContent.toString()
    const recipeObjects: IRecipe[] = JSON.parse(fileData)
    return recipeObjects.map(object => new Recipe(object))
  }
}
