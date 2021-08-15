'use strict';

import { Router } from 'express'
import RecipeController from './controllers/RecipeController.js'

const router = Router()
const recipeController = new RecipeController()

router.get('/', recipeController.index)
router.get('/create', recipeController.create)
router.post('/create', recipeController.store)
router.get('/:id', recipeController.show)

export default router
