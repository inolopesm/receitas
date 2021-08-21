import fs from 'fs/promises'
import Recipe, { IRecipe } from '../models/Recipe'

export default class RecipeRepository {
  static async save(recipe: Recipe): Promise<void> {
    const recipes = await RecipeRepository.getAll()
    const index = recipes.findIndex(r => r.id === recipe.id)

    if (index === -1) {
      recipes.push(recipe)
    } else {
      recipes[index] = recipe
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
