const { mysql } = require('../connection')


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