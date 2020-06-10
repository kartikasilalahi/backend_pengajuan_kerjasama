const express = require('express')
const { authController, adminController } = require('../controller')

const router = express.Router()

router.post('/register', authController.Register)
router.get('/login', authController.Login)
router.get('/login/:id', authController.Login)


module.exports = router