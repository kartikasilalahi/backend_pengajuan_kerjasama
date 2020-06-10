const express = require('express')
const { adminController } = require('../controller')

const router = express.Router()

router.get('/alluser', adminController.getAllUser)
router.get('/verified', adminController.userVerified)
router.get('/unverified', adminController.userUnverified)

router.put('/verifyuser', adminController.verifyUser)


module.exports = router