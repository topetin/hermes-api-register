const nodemailer = require('nodemailer')
const emailService = {}

const sender = 'Hermes Chat App'
const newSubscriptionSubject = 'Gracias por suscribirte!'
const newSubscriptionText = 'Segui el link para generar tu password: http://localhost:4600/activateAccount?type=1&id='

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

emailService.sendEmailSubscription = (userEmail, userId) => {
  const text = newSubscriptionText + userId
    transporter.sendMail({
        from: sender,
        to: userEmail,
        subject: newSubscriptionSubject,
        text: text
    }, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
}
  
module.exports = emailService