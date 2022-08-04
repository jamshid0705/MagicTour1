
const settingAccount=async(formData)=>{

 try {
  const res=await axios({
    method:'PATCH',
    url:`http://localhost:8000/api/v1/users/updateMeData`,
    data:formData
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
        window.setTimeout(()=>{
          location.assign('/')
        },500)
      }
    console.log(res)
  } catch (error) {
    alert('Sizning passwordingiz yangilandi !')
      window.setTimeout(()=>{
        location.reload(true)
      },500)
  }
  
 
}

document.querySelector('.form-user-data').addEventListener('submit',(e)=>{
  e.preventDefault()
  const name=document.querySelector('#name').value
  const email=document.querySelector('#email').value
  const photo=document.querySelector('#photo').files[0]

  let formData=new FormData()
  formData.append('name',name)
  formData.append('email',email)
  formData.append('photo',photo)

  console.log(name,email,photo)
  settingAccount(formData)
 
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