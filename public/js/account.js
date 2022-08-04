
const settingAccount=async(name,email)=>{

 try {
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
      window.setTimeout(()=>{
        location.reload(true)
      },500)
    }
  console.log(res)
 } catch (error) {
   alert(error.response.data.message)
 }

}


const passwordAccount=async(password,newpassword,passwordConfirm)=>{
  try {
    const res=await axios({
      method:'PATCH',
      url:'http://localhost:8000/api/v1/users/updatemepassword',
      data:{
        oldpassword:password,
        newpassword:newpassword,
        newpasswordConfirm:passwordConfirm
      }
    })
      if(res.status==200){
        alert('Sizning passwordingiz yangilandi !')
      }
    console.log(res)
  } catch (error) {
    alert('Sizning passwordingiz yangilandi !')
      window.setTimeout(()=>{
        location.reload('/')
      },500)
  }
  
 
}

document.querySelector('.form-user-data').addEventListener('submit',(e)=>{
  e.preventDefault()
  const name=document.querySelector('#name').value
  const email=document.querySelector('#email').value

  console.log(name,email)
  settingAccount(name,email)
 
  document.querySelector('#name').value=' '
  document.querySelector('#email').value=' '
})

document.querySelector('.btn--password').addEventListener('click',(e)=>{
  e.preventDefault()
  const password=document.querySelector('#password-current').value
  const newpassword=document.querySelector('#password').value
  const passwordConfirm=document.querySelector('#password-confirm').value

  console.log(password,newpassword,passwordConfirm)
  passwordAccount(password,newpassword,passwordConfirm)

  document.querySelector('#password-current').value='•••••••• '
  document.querySelector('#password').value='•••••••• '
  document.querySelector('#password-confirm').value='•••••••• '

})