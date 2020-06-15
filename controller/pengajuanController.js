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

            const uploadDoc = uploader(path, 'doc').fields([{ name: 'dokumen' }])

            /* -------- upload ----- */
            uploadDoc(req, res, err => {
                if (err) return res.status(500).json({ message: 'Upload doc gagal', error: err.message })
                const { dokumen } = req.files

                let data = JSON.parse(req.body.data)

                let docs = {}
                dokumen.forEach((val, i) => {
                    if (i === 0) docs.MOU = path + '/' + val.filename
                    else if (i === 1) docs.MOA = path + '/' + val.filename
                    if (i === 2) docs.IA = path + '/' + val.filename
                    if (i === 3) docs.perpanjangan = path + '/' + val.filename
                })
                console.log('ini doc', docs.MOA)

                console.log('dta', data)

                sql = `INSERT INTO pengajuan SET 
                        pengaju='${data.pengaju}', 
                        no_pengaju='${data.no_pengaju}', 
                        PIC='${data.PIC}', 
                        no_PIC='${data.no_PIC}', 
                        nama_institusi='${data.nama_institusi}', 
                        alamat_institusi='${data.alamat_institusi}', 
                        idbidang=${data.idbidang}, 
                        pejabat='${data.pejabat}', 
                        jabatan='${data.jabatan}', 
                        unit='${data.unit}', 
                        MOU='${docs.MOU}', 
                        MOA='${docs.MOA}', 
                        IA='${docs.IA}', 
                        perpanjangan='${docs.perpanjangan}', 
                        penanggungjawab='${data.penanggungjawab}'`

                mysql.query(sql, (error, result) => {
                    if (error) return res.status(500).json({ message: "Ada salah query insert pengajuan", error: error.message })

                    res.status(200).send(result)
                })


            })
        } catch (error) {
            console.log(error)

        }
    }

}












                // /* -------- MOA ----- */
                // uploadMOA(req, res, err2 => {
                //     if (err2) return res.status(500).json({ message: 'Upload MOA gagal', error: err2.message })
                //     const { fileMOA } = req.files
                //     const MOA = fileMOA ? pathMOA + '/' + fileMOA[0].filename : null

                //     console.log('in', req.files)
                //     console.log('moa', MOA)

                //     /* -------- IA ----- */
                //     uploadIA(req, res, err3 => {
                //         if (err3) return res.status(500).json({ message: 'Upload IA gagal', error: err3.message })
                //         const { fileIA } = req.files
                //         const MIA = fileIA ? path + '/' + fileIA[0].filename : null

                //         /* -------- Perpanjangan ----- */
                //         uploadPerpanjangan(req, res, err4 => {
                //             if (err4) return res.status(500).json({ message: 'Upload Perpanjangan gagal', error: err4.message })
                //             const { filePerpanjangan } = req.files
                //             const perpanjangan = filePerpanjangan ? path + '/' + filePerpanjangan[0].filename : null