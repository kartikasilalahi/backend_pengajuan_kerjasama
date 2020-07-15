const { mysql } = require('../connection')
const { uploader } = require('../helper/uploader')
const transporter = require('../helper/mailer')


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
    //     GET AJUAN MITRA 
    // -------------------------
    getOnprocessMitra: (req, res) => {
        let { id } = req.params
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where idmitra = ${id} AND status='accept'`
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


    // -----------------------------
    //     GET Review Penilaian
    // ------------------------------
    getReviewPenilaianKerjasama: (req, res) => {
        let { id } = req.params
        let sql = `SELECT * FROM penilaian WHERE id_pengajuan=${id}`
        console.log('sql', sql)
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
        id = parseInt(id)

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


                /* -------------- NOTIF KE EMAIL -------------- */
                sql = `SELECT idmitra FROM pengajuan WHERE id=${id}`
                mysql.query(sql, (err_id, result_id) => {
                    if (err_id) return res.status(500).json({ message: "Ada salah query insert penilaian", err_id: err_id.message })

                    sql = `SELECT email from akun where id = ${result_id[0].idmitra}`
                    mysql.query(sql, (err_mail, result_mail) => {
                        if (err_mail) return res.status(500).json({ message: "Ada salah query insert penilaian", err_mail: err_mail.message })

                        console.log('email', result_mail[0].email);
                        let mailoptions = {
                            from: 'Administrator PK-UMB <buildwithmeh@gmail.com>',
                            to: result_mail[0].email,
                            subject: `Notifikasi Terima/Tolak Kerjasama - Pengajuan Kerjasama UMB (PK-UMB)`,
                            html:
                                `<h3>Pengajuan Kerjasama Universitas Mercubuana </h3> 
                                <p style="color:grey;font-size:18px; font-weight:bold">
                                Terima Kasih telah melakukan Pendaftaran / Pengajuan Kerjasama dengan Universitas Mercubuana di <span style="color:blue;"> Layanan Pengajuan Kerjasama UMB</span><br/>
                            </p>
                            <div style="font-size:14px;">
                                <p>Pengajuan  Kerjasama telah Kami terima dan Kami setujui. Saat ini Pihak kerjasama Instansi Anda dan Universitas Mercubuana sedang berlangsung hingga waktu kesepakatan bersama yang ditentukan. Selamat bekerjasama. Terimkasih</p>
                            </div>`
                        }
                        transporter.sendMail(mailoptions, (err_email, result_email) => {
                            if (err_email) return res.status(500).send({ message: err_email })
                            return res.status(200).send({ message: 'berhasil kirim', result_email })
                        })
                    })
                })
                /* -------------- NOTIF KE EMAIL -------------- */

                /* --- nge get daftar pengajuan yg waiting --- */
                sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='waiting'`
                mysql.query(sql, (err2, result2) => {
                    if (err2) return res.status(500).json({ message: "Ada salah query select waiting", err2: err2.message })

                    /* --- nge get daftar pengajuan yg accept --- */
                    sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='accept'`
                    mysql.query(sql, (err3, result3) => {
                        if (err3) return res.status(500).json({ message: "Ada salah query select accept", err3: err3.message })

                        /* --- nge get all penilaian --- */
                        sql = `SELECT * FROM penilaian `;
                        mysql.query(sql, (err4, result4) => {
                            if (err4) return res.status(500).json({ message: "Ada salah query select * penilaian", err4: err4.message })

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
        id = parseInt(id)

        /* --- set status menjadi decline ---- */
        let sql = `UPDATE pengajuan SET status='decline' where id=${id}`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)

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

                /* -------------- NOTIF KE EMAIL -------------- */
                sql = `SELECT idmitra FROM pengajuan WHERE id=${id}`
                mysql.query(sql, (err_id, result_id) => {
                    if (err_id) return res.status(500).json({ message: "Ada salah query insert penilaian", err_id: err_id.message })

                    sql = `SELECT email from akun where id = ${result_id[0].idmitra}`
                    mysql.query(sql, (err_mail, result_mail) => {
                        if (err_mail) return res.status(500).json({ message: "Ada salah query insert penilaian", err_mail: err_mail.message })

                        console.log('email', result_mail[0].email);
                        let mailoptions = {
                            from: 'Administrator PK-UMB <buildwithmeh@gmail.com>',
                            to: result_mail[0].email,
                            subject: `Notifikasi Terima/Tolak Kerjasama - Pengajuan Kerjasama UMB (PK-UMB)`,
                            html:
                                `<h3>Pengajuan Kerjasama Universitas Mercubuana </h3> 
                                    <p style="color:grey;font-size:18px; font-weight:bold">
                                    Terima Kasih telah melakukan Pendaftaran / Pengajuan Kerjasama dengan Universitas Mercubuana di <span style="color:blue;"> Layanan Pengajuan Kerjasama UMB</span><br/>
                                </p>
                                <div style="font-size:14px;">
                                    <p>Pengajuan Kerjasama telah Kami terima dan Kami baca. Saat ini Pihak Universitas Mercubuana belum dapat bekerjasama dengan Pihak Instansi Anda dikarenakan beberapa alasan dan pertimbangan. Mungkin Pihak UMB dapat bekerjasama dengan Instansi Anda dilain kesempatan. Mohon maaf atas ketidaknyamanannya, kami ucapkan Terimkasih</p>
                                </div>`
                        }
                        transporter.sendMail(mailoptions, (err_email, result_email) => {
                            if (err_email) return res.status(500).send({ message: err_email })
                            return res.status(200).send({ message: 'berhasil kirim', result_email })
                        })
                    })
                })
                /* -------------- NOTIF KE EMAIL -------------- */

                /* --- nge get daftar pengajuan yg waiting --- */
                sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang WHERE status='waiting '`
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
    },


    // ----------------------------
    //        ADD EVALUASI
    // ----------------------------
    addEvaluasi: (req, res) => {
        console.log('body', req.body);

        let sql = `INSERT INTO evaluasi SET ?`
        mysql.query(sql, req.body, (err, result) => {
            if (err) return res.status(500).json({ message: "Ada salah query insert evaluasi", err: err.message })
            console.log('1a');

            sql = `UPDATE pengajuan SET status='finish' where id=${req.body.id_pengajuan}`
            mysql.query(sql, (err1, result1) => {
                if (err1) return res.status(500).json({ message: "Ada salah query update status", err1: err1.message })
                console.log('2');

                sql = `SELECT * FROM evaluasi WHERE id_instansi=${req.body.id_instansi}`
                mysql.query(sql, (err2, result2) => {
                    if (err2) return res.status(500).json({ message: "Ada salah query select evaluasi", err2: err2.message })
                    console.log('3');

                    // return res.status(200).send({ })

                    sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang WHERE status='waiting' AND idmitra = ${req.body.id_instansi} `
                    mysql.query(sql, (err3, result3) => {
                        if (err3) return res.status(500).json({ message: "Ada salah query select waiting", err3: err2.message })

                        console.log('4')

                        /* --- nge get daftar pengajuan yg decline --- */
                        sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang WHERE status='accept' AND idmitra = ${req.body.id_instansi} `
                        mysql.query(sql, (err4, result4) => {
                            if (err4) return res.status(500).json({ message: "Ada salah query select accept", err4: err3.message })

                            console.log(5)


                            /* --- nge get all penilaian --- */
                            sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang WHERE status='finish' AND idmitra = ${req.body.id_instansi} `;
                            mysql.query(sql, (err5, result5) => {
                                if (err5) return res.status(500).json({ message: "Ada salah query select finish", err5: err5.message })
                                console.log(6)

                                // console.log('decline', result3)
                                return res.status(200).send({ evaluasi: result2, waiting: result3, accept: result4, finish: result5 })
                            })
                        })
                    })
                })
            })
        })
    },

    // ----------------------------
    //       GET HISTORY
    // ----------------------------
    getHistory: (req, res) => {
        let { id } = req.params
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where (status='finish' OR status ='decline' )AND idmitra=${id}`
        mysql.query(sql, (err, result) => {
            if (err) res.status(500).json({ message: 'salah selct history', err: err.message })

            return res.status(200).send(result)
        })
    },


    // ----------------------------
    //    GET ALL HISTORY
    // ----------------------------
    getAllHistory: (req, res) => {
        let sql = `SELECT * FROM pengajuan p JOIN bidang_kerjasama b ON p.idbidang = b.id_bidang where status='finish' OR status ='decline'`
        mysql.query(sql, (err, result) => {
            if (err) res.status(500).json({ message: 'salah selct history', err: err.message })
            return res.status(200).send(result)
        })
    },


    // ----------------------------
    //       GET EVALUASI
    // ----------------------------
    getEvaluasi: (req, res) => {
        let { id } = req.params
        let sql = `SELECT * FROM evaluasi WHERE id_pengajuan=${id}`
        mysql.query(sql, (err, result) => {
            if (err) res.status(500).json({ message: 'salah selct evaluasi', err: err.message })
            return res.status(200).send(result)
        })
    }


}
