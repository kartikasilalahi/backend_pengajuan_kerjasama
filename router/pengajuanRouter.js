const express = require('express')
const { pengajuanController } = require('../controller')

const router = express.Router()

router.get('/getbidang', pengajuanController.getBidang)
router.post('/addpengajuan', pengajuanController.addPengajuan)
router.get('/getajuan/:id', pengajuanController.getAjuan)


module.exports = router