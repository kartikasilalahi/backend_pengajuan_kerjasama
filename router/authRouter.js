const express = require('express')
const { authController } = require('../controller')

const router = express.Router()

router.post('/register', authController.Register)
router.get('/login', authController.Login)
router.get('/login/:id', authController.Login)
router.get('/getprofil/:id', authController.GetProfil)
router.put('/editprofil/:id', authController.EditProfil)
router.put('/ubahemail/:id', authController.UbahEmail)
router.put('/editpassword/:id', authController.editPassword)


module.exports = router