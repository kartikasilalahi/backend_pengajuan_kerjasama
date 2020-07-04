const express = require('express')
const { pengajuanController } = require('../controller')

const router = express.Router()

router.get('/getbidang', pengajuanController.getBidang)
router.post('/addpengajuan', pengajuanController.addPengajuan)
router.get('/getajuan/:id', pengajuanController.getAjuan)
router.get('/getonprocess/:id', pengajuanController.getOnprocessMitra)
router.get('/allnewpengajuan', pengajuanController.getAllNewPengajuan)
router.get('/allaccept', pengajuanController.getAllAccept)
router.get('/alldecline', pengajuanController.getAllDecline)
router.put('/accept/:id', pengajuanController.acceptNewPengajuan)
router.put('/decline/:id', pengajuanController.declineNewPengajuan)
router.get('/getreviewpenilaian/:id', pengajuanController.getReviewPenilaianKerjasama)
router.post('/addevaluasi', pengajuanController.addEvaluasi)
router.get('/gethistory/:id', pengajuanController.getHistory)


module.exports = router