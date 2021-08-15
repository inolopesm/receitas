'use strict';

import express from 'express'
import router from './router.js'

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.urlencoded({ extended: false }))
app.use(router)

export default app
