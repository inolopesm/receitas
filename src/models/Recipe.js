'use strict';

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

 export default class Recipe {
    /**
     * Método responsável por criar uma receita
     * @param {IRecipeConstructor} params
     */
    constructor({ id = uuid(), title, mealType, numberOfPeopleItServes, difficultyLevel, listOfIngredients, preparationSteps, createdAt = new Date().toISOString() }) {
        this.id = id
        this.title = title
        this.mealType = mealType
        this.numberOfPeopleItServes = numberOfPeopleItServes
        this.difficultyLevel = difficultyLevel
        this.listOfIngredients = listOfIngredients
        this.preparationSteps = preparationSteps
        this.createdAt = createdAt
    }

    /**
     * Método responsável por retornar um objeto simples da classe
     * @return {IRecipe}
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            mealType: this.mealType,
            numberOfPeopleItServes: this.numberOfPeopleItServes,
            difficultyLevel: this.difficultyLevel,
            listOfIngredients: this.listOfIngredients,
            preparationSteps: this.preparationSteps,
            createdAt: this.createdAt
        }
    }

    /**
     * Método responsável por salvar a receita na persistência
     * @returns {Promise<void>}
     */
    async save() {
        const recipes = await Recipe.getAll()
        const index = recipes.findIndex(recipe => recipe.id === this.id)

        if (index !== -1) {
            recipes.push(this)
        } else {
            recipes[index] = this
        }

        const fileData = JSON.stringify(recipes, null, 4)
        await fs.writeFile('./src/data/recipes.json', fileData)
    }

    /**
     * Método responsável por trazer as receitas da persistência
     * @returns {Promise<Recipe[]>}
     */
    static async getAll() {
        const fileContent = await fs.readFile('./src/data/recipes.json')
        const fileData = fileContent.toString()

        /** @type {IRecipe[]} */
        const recipeObjects = JSON.parse(fileData)

        return recipeObjects.map(object => new Recipe(object))
    }
}
