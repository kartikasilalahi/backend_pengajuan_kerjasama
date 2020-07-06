const cryptogenerate = require('../helper/encrypt')
const { mysql } = require('../connection')

module.exports = {

    crypto: (req, res) => {
        console.log(req.query)
        const hashpassword = cryptogenerate(req.query.password)
        res.send({ encryptan: hashpassword, panjangencrypt: hashpassword.length })
    },

    // ------------------
    //     REGISTER 
    // ------------------
    Register: (req, res) => {
        let { nama, alamat, email, phone, password, linkperusahaan, jenisperusahaan } = req.body
        console.log(req.body)
        let sql = `SELECT * FROM akun WHERE email='${email}'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send({ err })

            if (result.length > 0) {
                return res.status(200).send({ status: 'REGISTER_ERROR', message: 'Email Sudah Terdaftar' })
            } else {
                let hashpassword = cryptogenerate(password)
                let dataAkun = {
                    nama,
                    password: hashpassword,
                    email,
                    phone,
                    alamat,
                    status: 'unverified',
                    roleid: 2,
                    linkperusahaan,
                    jenisperusahaan
                }
                sql = `INSERT INTO akun SET ?`
                mysql.query(sql, dataAkun, (err2, result2) => {
                    if (err2) return res.status(500).send({ err2 })

                    return res.status(200).send({ status: 'REGISTER_SUCCESS', message: 'Berhasil Registrasi. Mohon Menunggu Hingga Admin Memverifikasi Akun Anda.' })
                })
                // '
            }
        })
    },


    // ------------------
    //       LOGIN
    // ------------------
    Login: (req, res) => {
        let { id } = req.params
        let { email, password } = req.query

        if (password === '' || email === '') {
            res.status(200).send({ status: "LOGIN_ERROR", message: "Pastikan Semua Form Terisi" })

        }
        else if (email || password) {
            let hashpassword = cryptogenerate(password)
            console.log('1')
            let sql = `SELECT * FROM akun WHERE email='${email}' AND password='${hashpassword}'`
            console.log(sql)
            mysql.query(sql, (err, result) => {
                if (err) res.status(500).send({ disini: err })
                console.log(result)
                if (result !== undefined) {
                    if (result[0].status === 'verified') {
                        console.log('diver', result[0].id)

                        res.send({
                            status: 'LOGIN_SUCCESS',
                            result: { email, roleid: result[0].roleid, id: result[0].id }, phone: result[0].phone, phone: result[0].phone,
                            id: result[0].id
                        })
                    }

                    else {
                        console.log('unver')
                        res.status(200).send({ status: "LOGIN_ERROR", message: "Akun anda belum terverifikasi Administrator." })
                    }
                }
                else {
                    console.log('incorect')
                    res.status(200).send({ status: "LOGIN_ERROR", message: "Email atau Password Anda Salah atau Belum Terdaftar" })
                }
            })
        } else {
            if (id) {
                sql = `SELECT * from akun where id=${id}`
                mysql.query(sql, (err, result) => {
                    if (err) res.status(500).send({ status: 'error!!!!!', message: err })

                    res.send({
                        status: 'LOGIN_SUCCESS',
                        result: { email, roleid: result[0].roleid, id: result[0].id }, phone: result[0].phone, phone: result[0].phone,
                        id: result[0].id
                    })
                })
            } else {
                console.log('masih kosong nihhh')
                res.status(200).send({ status: "LOGIN_ERROR", message: "Pastikan Semua Form Terisi" })
            }
        }
    },


    // ---------------------
    //       GET PROFIL
    // ---------------------
    GetProfil: (req, res) => {
        let { id } = req.params
        let sql = `SELECT nama, phone, alamat, email, linkperusahaan, jenisperusahaan FROM akun WHERE id='${id}'`
        mysql.query(sql, (err1, result1) => {
            if (err1) res.status(500).send(err1)
            res.status(200).send(result1)
        })
    },

    // ---------------------
    //       EDIT PROFIL
    // ---------------------
    EditProfil: (req, res) => {
        let id = Number(req.params.id)
        let { nama } = req.body
        let sql = `SELECT * FROM akun WHERE nama='${nama}'`
        mysql.query(sql, (err1, result1) => {
            if (err1) return res.status(500).send(err)
            if (result1.length > 0 && result1[0].id !== id) {
                return res.status(200).send({ status: 'editproferr', message: 'Maaf Nama Sudah Terdaftar' })
            }

            sql = `UPDATE akun SET ? WHERE id=${id}`
            console.log(req.body)
            mysql.query(sql, req.body, (err2, result2) => {
                console.log('4');
                if (err2) return res.status(500).send({ message: err2, pesa: 'errr' })

                return res.status(200).send(result2)
            })
        })
    },

    // ---------------------
    //       UBAH PROFIL
    // ---------------------
    UbahEmail: (req, res) => {
        let id = Number(req.params.id)
        let { email } = req.body
        console.log(req.body)
        let sql = `SELECT * FROM akun WHERE email='${email}'`
        mysql.query(sql, (err1, result1) => {
            if (err1) return res.status(500).send(err)

            if (result1.length > 0 && result1[0].id !== id) {
                return res.status(200).send({ status: 'error', message: 'Maaf Email Sudah Terdaftar' })
            } else if (result1.length > 0 && result1[0].id === id) {
                return res.status(200).send({ status: 'warning', message: 'Login Masih Menggunakan Email yang Lama' })
            }

            sql = `UPDATE akun SET email='${email}' WHERE id=${id}`
            console.log('sql', sql)
            mysql.query(sql, (err2, result2) => {
                if (err2) throw err2
                // if (err2) return res.status(500).send({ message: err2, pesa: 'errr' })
                return res.status(200).send(result2)
            })
        })
    },


    // ---------------------
    //    UBAH PASSWORD
    // ---------------------
    editPassword: (req, res) => {
        let { id } = req.params
        let { password, newpassword } = req.body
        console.log(req.body)
        let hashpassword = cryptogenerate(password)
        console.log(hashpassword)
        let sql = `SELECT * FROM akun WHERE id=${id}`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            console.log('1');

            if (hashpassword == result[0].password) {

                let hassnewpass = cryptogenerate(newpassword)
                sql = `UPDATE akun SET password='${hassnewpass}' WHERE id=${id}`
                mysql.query(sql, (err2, result2) => {
                    if (err2) return res.status(500).send(err2)
                    return res.status(200).send({ msg: '' })
                })
            } else {
                console.log('slah pass')
                return res.status(200).send({ msg: "Password Saat Ini Salah!" })
            }
        })
    }
}




