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
                        penanggungjawab='${data.penanggungjawab}',
                        bidanglain = '${data.bidanglain}',
                        idmitra=${data.idmitra},
                        status='waiting'`

                mysql.query(sql, (error, result) => {
                    if (error) return res.status(500).json({ message: "Ada salah query insert pengajuan", error: error.message })

                    res.status(200).send(result)
                })


            })
        } catch (error) {
            console.log(error)
        }
    },


    // -------------------------
    //     GET AJUAN MITRA 
    // -------------------------
    getAjuan: (req, res) => {
        let { id } = req.params
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where idmitra = ${id} AND status='waiting'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },

    // -------------------------
    //     GET ALL PENGAJUAN
    // -------------------------
    getAllNewPengajuan: (req, res) => {
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='waiting'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },

    // ------------------------------------
    //     GET ALL accept (ONPROCESS)
    // ------------------------------------
    getAllAccept: (req, res) => {
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='accept'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },

    // ---------------------------
    //     GET ALL DECLINE
    // ---------------------------
    getAllDecline: (req, res) => {
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='decline'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },


    // ----------------------------
    //     ACCEPT NEW PENGAJUAN
    // ----------------------------
    acceptNewPengajuan: (req, res) => {
        let { id } = req.params
        /* --- set status menjadi accept ---- */
        let sql = `UPDATE pengajuan SET status='accept' where id=${id}`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            console.log(1)


            /* --- insert di table penilaian ---- */
            let dataPenilaian = req.body
            console.log('data Penilaian', dataPenilaian);
            sql = `INSERT INTO penilaian SET
                id_pengajuan = ${dataPenilaian.id_pengajuan},
                nilai_profil='${dataPenilaian.profil_institusi}',
                nilai_kinerja='${dataPenilaian.kinerja_institusi}',
                nilai_reputasi='${dataPenilaian.reputasi_institusi}',
                nama_reviewer='${dataPenilaian.nama_reviewer}',
                jabatan_reviewer='${dataPenilaian.jabatan_reviewer}'`
            console.log(sql)
            mysql.query(sql, (err1, result1) => {
                if (err1) return res.status(500).json({ message: "Ada salah query insert penilaian", err1: err1.message })

                console.log(2)

                /* --- nge get daftar pengajuan yg waiting --- */
                sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='waiting'`
                mysql.query(sql, (err2, result2) => {
                    if (err2) return res.status(500).json({ message: "Ada salah query select waiting", err2: err2.message })

                    console.log(3)

                    /* --- nge get daftar pengajuan yg accept --- */
                    sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='accept'`
                    mysql.query(sql, (err3, result3) => {
                        if (err3) return res.status(500).json({ message: "Ada salah query select accept", err3: err3.message })

                        console.log(4)


                        /* --- nge get all penilaian --- */
                        sql = `SELECT * FROM penilaian `;
                        mysql.query(sql, (err4, result4) => {
                            if (err4) return res.status(500).json({ message: "Ada salah query select * penilaian", err4: err4.message })
                            console.log(5)

                            return res.status(200).send({ waiting: result2, accept: result3, penilaian: result4 })
                        })
                    })
                })
            })
        })
    },


    // ----------------------------
    //     DECLINE NEW PENGAJUAN
    // ----------------------------
    declineNewPengajuan: (req, res) => {
        let { id } = req.params
        /* --- set status menjadi decline ---- */
        let sql = `UPDATE pengajuan SET status='decline' where id=${id}`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            console.log(1)

            console.log(sql)


            /* --- insert di table penilaian ---- */
            let dataPenilaian = req.body
            console.log('data Penilaian', dataPenilaian);
            sql = `INSERT INTO penilaian SET
                id_pengajuan = ${dataPenilaian.id_pengajuan},
                nilai_profil='${dataPenilaian.profil_institusi}',
                nilai_kinerja='${dataPenilaian.kinerja_institusi}',
                nilai_reputasi='${dataPenilaian.reputasi_institusi}',
                nama_reviewer='${dataPenilaian.nama_reviewer}',
                jabatan_reviewer='${dataPenilaian.jabatan_reviewer}'`
            mysql.query(sql, (err1, result1) => {
                if (err1) return res.status(500).json({ message: "Ada salah query insert penilaian", err1: err1.message })

                console.log(2)

                /* --- nge get daftar pengajuan yg waiting --- */
                sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang WHERE status='waiting'`
                mysql.query(sql, (err2, result2) => {
                    if (err2) return res.status(500).json({ message: "Ada salah query select waiting", err2: err2.message })

                    console.log(3)

                    /* --- nge get daftar pengajuan yg decline --- */
                    sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang WHERE status='decline'`
                    mysql.query(sql, (err3, result3) => {
                        if (err3) return res.status(500).json({ message: "Ada salah query select decline", err3: err3.message })

                        console.log(4)


                        /* --- nge get all penilaian --- */
                        sql = `SELECT * FROM penilaian `;
                        mysql.query(sql, (err4, result4) => {
                            if (err4) return res.status(500).json({ message: "Ada salah query select * penilaian", err4: err4.message })
                            console.log(5)

                            // console.log('decline', result3)
                            return res.status(200).send({ waiting: result2, decline: result3, penilaian: result4 })
                        })
                    })
                })
            })
        })
    }

}
