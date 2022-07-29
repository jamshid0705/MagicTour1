const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const nodemailer=require('nodemailer')

console.log(process.env.EMAIL_HOST)

const mail=async (options)=>{
 
  // 1 Transporter yaratish

  const transport=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
    },
    tls:{
      rejectUnauthorized:false,
    }
  })
  // 2 Mailni nastroyka qilish

  const mailOptins={

    from:options.from,
    to:options.to,
    subject:options.subject,
    text:options.text,
    html:options.html
  }

  // 3 mailni jonatish

  await transport.sendMail(mailOptins)

  return
}

// mail({from:"jamshidxatamov0705@gmail.com",to:'jamshidshamshod0705@gmail.com',subject:"Xat keldi",text:'assalom'})

module.exports=mail;