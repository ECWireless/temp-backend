// Imports
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const router = express.Router()

// Initialize Port and App
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

const app = express();

// Set up transporter
const transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});


router.post('/mail', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const number = req.body.number
    const message = req.body.message
    const content = (
        `
            Name: ${name}
            Email: ${email}
            Number: ${number}
            Message:
            ${message}
        `
    )

    const mail = {
        from: 'Elliott@valtechcreative.com',
        to: 'Elliott@valtechcreative.com',
        subject: 'New Valtech Submission Form',
        text: content
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })

            transporter.sendMail({
                from: "Elliott@valtechcreative.com",
                to: email,
                subject: "Submission was successful",
                text: (
                    `Thank you for contacting us! We will get back to you in less than 24 hours.

                    FORM DETAILS:
                    Name: ${name}
                    Email: ${email}
                    Message: ${message}
                    `
                )
            }, function(error, info){
                if(error) {
                    console.log(error);
                } else{
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    })
})

app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(port, () => console.log(`App listening on port ${port}`))
