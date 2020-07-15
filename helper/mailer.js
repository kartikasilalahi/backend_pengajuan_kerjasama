const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "buildwithmeh@gmail.com",
        pass: "nyzefwgvwkihoroj"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter