const { mysql } = require('../connection')
const transporter = require('../helper/mailer')


module.exports = {

    // ------------------
    //   SEMUA USER
    // ------------------
    getAllUser: (req, res) => {
        let sql = `SELECT id,nama,phone,alamat,status,email, jenisperusahaan, linkperusahaan FROM akun where roleid=2`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },


    // ------------------------
    //  YANG SUDAH VERIFIKASI
    // ------------------------
    userVerified: (req, res) => {
        let sql = `SELECT id,nama,phone,alamat,status,email,jenisperusahaan, linkperusahaan FROM akun where roleid=2 AND status='verified'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },


    // ------------------------
    //  YANG BELUM VERIFIKASI
    // ------------------------
    userUnverified: (req, res) => {
        let sql = `SELECT id,nama,phone,alamat,status,email, jenisperusahaan, linkperusahaan FROM akun where roleid=2 AND status='unverified'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(result)
        })
    },


    // ------------------------
    //    VERIFIKASI AKUN
    // ------------------------
    verifyUser: (req, res) => {
        let { email } = req.body

        let sql = `SELECT * FROM akun WHERE email='${email}'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send({ status: 'error di select 1 ver user', err })
            if (result.length === 0) {
                return res.status(500).send({ status: 'error', err1: 'user not found' })
            }

            let password = result[0].password

            sql = `UPDATE akun SET status='verified' WHERE email='${email}' AND password='${password}'`

            mysql.query(sql, (err1, result1) => {
                if (err1) return res.status(500).json({ message: " err di sql verify", error: err1.message })

                console.log(email)

                /* -------------- NOTIF KE EMAIL -------------- */
                let mailoptions = {
                    from: 'Administrator PK-UMB <buildwithmeh@gmail.com>',
                    to: email,
                    subject: `Notifikasi Verifikasi Akun - Pengajuan Kerjasama UMB (PK-UMB)`,
                    html:
                        `<h3>Pengajuan Kerjasama Universitas Mercubuana </h3> 
                        <p style="color:grey;font-size:18px; font-weight:bold">
                        Terima Kasih telah melakukan Pendaftaran / Registrasi Akun di <span style="color:blue;"> Layanan Pengajuan Kerjasama UMB</span><br/>
                    </p>
                    <div style="font-size:14px;">
                        <p>Akun Anda telah diverifikasi oleh Admin / Pihak UMB. Saat ini Anda sudah dapat masuk ke Halaman Pengajuan Kerjasama UMB, Silakan login dan Ajukan Kerjasama Instansi Anda. Terimakasih</p>
                    </div>`
                }
                transporter.sendMail(mailoptions, (err_email, result_email) => {
                    if (err_email) return res.status(500).send({ message: err_email })
                    return res.status(200).send({ message: 'berhasil kirim', result_email })
                })
                /* -------------- NOTIF KE EMAIL -------------- */


                sql = `SELECT id,nama,phone,alamat,status,email, jenisperusahaan, linkperusahaan FROM akun where roleid=2 AND status='unverified'`
                mysql.query(sql, (err2, result2) => {
                    if (err2) return res.status(500).send(err2)

                    sql = `SELECT id,nama,phone,alamat,status,email, jenisperusahaan, linkperusahaan FROM akun where roleid=2 AND status='verified'`
                    mysql.query(sql, (err3, result3) => {
                        if (err3) return res.status(500).send(err3)
                        return res.status(200).send({ unver: result2, ver: result3 })
                    })
                })
            })
        })
    }
}