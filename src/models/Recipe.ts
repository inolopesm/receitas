import * as uuid from 'uuid'

export interface IRecipe {
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
}
