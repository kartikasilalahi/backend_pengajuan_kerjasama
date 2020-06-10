const cryptogenerate = require('../helper/encrypt')
const { mysql } = require('../connection')
// const fs = require('fs')
// const transporter = require('../helper/mailer')
// const { createJWTToken } = require('./../helper/jwt')

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
        let { nama, alamat, email, phone, password, confpassword } = req.body
        let sql = `SELECT * FROM akun WHERE email='${email}'`
        mysql.query(sql, (err, result) => {
            if (err) return res.status(500).send({ err })

            if (result.length > 0) {
                return res.status(200).send({ status: 'REGISTER_ERROR', message: 'Email sudah terdaftar' })
            } else {
                let hashpassword = cryptogenerate(password)
                let dataAkun = {
                    nama,
                    password: hashpassword,
                    email,
                    phone,
                    alamat,
                    status: 'unverified',
                    roleid: 2
                }
                sql = `INSERT INTO akun SET ?`
                mysql.query(sql, dataAkun, (err2, result2) => {
                    if (err2) return res.status(500).send({ err2 })

                    return res.status(200).send({ status: 'REGISTER_SUCCESS', message: 'Berhasil Registrasi, Dimohon menunggu hingga Administrator melakukan verifikasi akun Anda. Terimkasih' })
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

        if (email || password) {
            let hashpassword = cryptogenerate(password)
            console.log('1')
            let sql = `SELECT * FROM akun WHERE email='${email}' AND password='${hashpassword}'`
            mysql.query(sql, (err, result) => {
                if (err) res.status(500).send({ disini: err })

                if (result[0] !== undefined) {
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
                    res.status(200).send({ status: "LOGIN_ERROR", message: "Email atau password anda salah atau belum terdaftar" })
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
                res.status(200).send({ status: "LOGIN_ERROR", message: "Pastikan semua terisi" })
            }
        }
    }

}




