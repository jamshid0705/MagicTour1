
const settingAccount=async(name,email)=>{
  const res=await axios({
    method:'PATCH',
    url:`http://localhost:8000/api/v1/users/updateMeData`,
    data:{
      name:name,
      email:email
    }
  })
    if(res.status==200){
      alert('Sizning name va email ingiz yangilandi !')
    }
  console.log(res)
}


const passwordAccount=async(password,newpassword,passwordConfirm)=>{
  const res=await axios({
    method:'PATCH',
    url:'http://localhost:8000/api/v1/users/updatemepassword',
    data:{
      oldpassword:password,
      newpassword:newpassword,
      newpasswordConfirm:passwordConfirm
    }
  })
    if(res.status==202){
      alert('Sizning passwordingiz yangilandi !')
    }
  console.log(res)
}

document.querySelector('.btn--setting').addEventListener('click',(e)=>{
  e.preventDefault()
  const name=document.querySelector('#name').value
  const email=document.querySelector('#email').value

  console.log(name,email)
  settingAccount(name,email)
})

document.querySelector('.btn--password').addEventListener('click',(e)=>{
  e.preventDefault()
  const password=document.querySelector('#password-current').value
  const newpassword=document.querySelector('#password').value
  const passwordConfirm=document.querySelector('#password-confirm').value

  console.log(password,newpassword,passwordConfirm)
  passwordAccount(password,newpassword,passwordConfirm)

})