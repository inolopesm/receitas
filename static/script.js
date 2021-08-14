'use strict';

/**
 * @typedef {Object} IRecipe
 * @property {string} title
 * @property {string} mealType
 * @property {number} numberOfPeopleItServes
 * @property {string} difficultyLevel
 * @property {string} listOfIngredients
 * @property {string} preparationSteps
 */

/**
 * Método responsável por manipular o resultado do fetch
 * @param {Response} response 
 * @returns {Promise<IRecipe[]>}
 */
function handleFetch(response) {
    return response.json()
}

/**
 * Método responsável por manipular receitas
 * @param {IRecipe[]} recipes 
 * @returns {void}
 */
function handleRecipes(recipes) {
    const ulElement = document.querySelector('ul')

    for (const recipe of recipes) {
        const liElement = document.createElement('li')
        liElement.innerText = recipe.title
        ulElement.appendChild(liElement)
    }
}

fetch('recipes.json').then(handleFetch).then(handleRecipes)
