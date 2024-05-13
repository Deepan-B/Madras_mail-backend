import express from 'express'
import {list} from "../Controllers/schemeController"

const router = express.Router()

router.post('/list' , list)

export default router