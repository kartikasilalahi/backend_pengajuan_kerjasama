const express = require('express')
const app = express()
const BodyParser = require('body-parser')
const cors = require('cors')   // untuk mengubungkan backend ke front end
const fs = require('fs')    // file system

const port = 9003

app.use(cors())
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())  // untuk client ngirim ke server
app.use(express.static('public'))

const { authRouter, adminRouter, pengajuanRouter } = require('./router')


app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/pengajuan', pengajuanRouter)

app.get('/', (req, res) => { return res.status(200).send(`<h1>API AKTIF DI PORT ${port}</h1>`) })
app.listen(port, () => console.log(`API AKTIF DI ${port}`))