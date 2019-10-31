const nodemailer = require('nodemailer')
const emailService = {}

const SENDER = 'Hermes Chat App'
const EMAIL_DEF = [
  {
    id: 1,
    'subscription': {
      subject: 'Gracias por suscribirte!',
      body: 'Segui el link para generar tu password: http://localhost:4200/activar-cuenta/'
    }
  }
]

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'apphermeschat@gmail.com',
      pass: 'Hermes2019'
    }
})
  
const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
}

emailService.sendEmail = (type, email, role_id) => {
  const def = EMAIL_DEF[role_id-1][type]
  const text = def.body + email
    transporter.sendMail({
        from: SENDER,
        to: email,
        subject: def.subject,
        text: text
    }, function(error, info){
        if (error) {
          throw error
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
}
  
module.exports = emailService