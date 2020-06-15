const { mysql } = require('../connection')
const { uploader } = require('../helper/uploader')

module.exports = {
    // -------------------------
    //    BIDANG KERJASAMA 
    // -------------------------
    getBidang: (req, res) => {
        let sql = `SELECT * FROM bidang_kerjasama`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },


    // -------------------------
    //    AJUKAN KERJASAMA 
    // -------------------------
    addPengajuan: (req, res) => {
        try {
            const path = '/mitra/dokumen'
            const uploadMOU = uploader(path, 'docMOU').fields([{ name: 'fileMOU' }])
            const uploadMOA = uploader(path, 'docMOA').fields([{ name: 'fileMOA' }])
            const uploadIA = uploader(path, 'docMOA').fields([{ name: 'fileIA' }])
            const uploadPerpanjangan = uploader(path, 'docMOA').fields([{ name: 'filePerpanjangan' }])

            uploadMOU(req, res, err1 => {
                if (err1) return res.status(500).json({ message: 'Upload MOU gagal', error: err1.message })
                uploadMOA(req, res, err2 => {
                    if (err2) return res.status(500).json({ message: 'Upload MOA gagal', error: err2.message })
                    uploadIA(req, res, err2 => {
                        if (err2) return res.status(500).json({ message: 'Upload IA gagal', error: err2.message })
                        uploadPerpanjangan(req, res, err2 => {
                            if (err2) return res.status(500).json({ message: 'Upload Perpanjangan gagal', error: err2.message })
                        })
                    })
                })
            })
        } catch (error) {
            console.log(error)

        }
    }

}