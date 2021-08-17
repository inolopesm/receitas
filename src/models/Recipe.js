'use strict';

import fs from 'fs/promises'
import { URL } from 'url'
import * as uuid from 'uuid'

/**
 * @typedef {Object} IRecipe
 * @property {string} id
 * @property {string} title
 * @property {string} mealType
 * @property {number} numberOfPeopleItServes
 * @property {string} difficultyLevel
 * @property {string} listOfIngredients
 * @property {string} preparationSteps
 * @property {string} photoUrl
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
 * @property {string|undefined} photoUrl
 * @property {string|undefined} createdAt
 */

 export default class Recipe {
    /**
     * Método responsável por criar uma receita
     * @param {IRecipeConstructor} params
     */
    constructor({ id = uuid.v4(), title, mealType, numberOfPeopleItServes, difficultyLevel, listOfIngredients, preparationSteps, photoUrl = '/static/images/capa-receita-padrao.png', createdAt = new Date().toISOString() }) {
        this.id = id
        this.title = title
        this.mealType = mealType
        this.numberOfPeopleItServes = numberOfPeopleItServes
        this.difficultyLevel = difficultyLevel
        this.listOfIngredients = listOfIngredients
        this.preparationSteps = preparationSteps
        this.photoUrl = photoUrl
        this.createdAt = createdAt
    }

    /**
     * Método responsável por validar uma receita
     * @returns {Error|null}
     */
    isValid() {
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

        if (new Date(this.createdAt) === 'Invalid Date' || isNaN(Date.parse(this.createdAt))) {
            return new Error('createdAt deve ser uma data válida')
        }

        return null
    }

    /**
     * Método responsável por salvar a receita na persistência
     * @returns {Promise<void>}
     */
    async save() {
        const recipes = await Recipe.getAll()
        const index = recipes.findIndex(recipe => recipe.id === this.id)

        if (index === -1) {
            recipes.push(this)
        } else {
            recipes[index] = this
        }

        const fileData = JSON.stringify(recipes, null, 4)
        await fs.writeFile('./data/recipes.json', fileData)
    }

    /**
     * Método responsável por trazer as receitas da persistência
     * @returns {Promise<Recipe[]>}
     */
    static async getAll() {
        const fileContent = await fs.readFile('./data/recipes.json')
        const fileData = fileContent.toString()

        /** @type {IRecipe[]} */
        const recipeObjects = JSON.parse(fileData)

        return recipeObjects.map(object => new Recipe(object))
    }
}
