const express = require('express')
const { pengajuanController } = require('../controller')

const router = express.Router()

router.get('/getbidang', pengajuanController.getBidang)
router.post('/addpengajuan', pengajuanController.addPengajuan)
router.get('/getajuan/:id', pengajuanController.getAjuan)
router.get('/allnewpengajuan', pengajuanController.getAllNewPengajuan)
router.put('/accept/:id', pengajuanController.acceptNewPengajuan)


module.exports = router