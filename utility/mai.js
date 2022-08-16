const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const nodemailer=require('nodemailer')
const pug=require('pug')

class Email{
  constructor(user,url){
    this.to=user.email
    this.from=`Jamshid Xatamov <${process.env.EMAIL_FROM}>`,
    this.url=url,
    this.name=user.name
  }
  // transportr creater
  transport(){
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  // Email option
  // send message
  async sendMessage(template,message){
    // template
    const pugTemplate=`${__dirname}/../views/mail/${template}.pug`
    const html=pug.renderFile(pugTemplate,{
      name:this.name,
      url:this.url,
      message:message,
    })
    // message ni kimga jo'natish
   
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: message,
      html: html,
    };
    // transport va 
    await this.transport().sendMail(mailOptions)
  }
  sendWelcome(){
    this.sendMessage("welcome","Hush kelibsiz bizning websaytimizga!")
  }
  sendPassword(){
    this.sendMessage('reset-password','Passwordingizni shu yerda yangilang !')
  }
  sendMess(){
    this.sendMessage('reset',"passwordingizni tekshiring!")
  }

}

// const mail=async (options)=>{
 
//   // 1 Transporter yaratish
//   const transport=nodemailer.createTransport({
//     host:process.env.EMAIL_HOST,
//     port:process.env.EMAIL_PORT,
//     auth:{
//       user:process.env.EMAIL_USER,
//       pass:process.env.EMAIL_PASS
//     },
//     tls:{
//       rejectUnauthorized:false,
//     }
//   })
//   // 2 Mailni nastroyka qilish

//   const mailOptins={

//     from:options.from,
//     to:options.to,
//     subject:options.subject,
//     text:options.text,
//     html:options.html
//   }

//   // 3 mailni jonatish

//   await transport.sendMail(mailOptins)

//   return
// }

// mail({from:"jamshidxatamov0705@gmail.com",to:'jamshidshamshod0705@gmail.com',subject:"Xat keldi",text:'assalom'})

module.exports=Email;