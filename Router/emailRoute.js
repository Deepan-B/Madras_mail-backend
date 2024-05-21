import express, { Router } from 'express'
import { createEmail } from '../Controllers/emailController.js';


const router = express.Router({ mergeParams: "true" })


router.route('/').post(createEmail)



export default router;