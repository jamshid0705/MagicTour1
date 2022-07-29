import '@babel/core'
import login from './login.js'


document.querySelector('.form').addEventListener('submit',(e)=>{
  e.preventDefault();
  const email=document.querySelector('#email').value;
  const password=document.querySelector('#password').value
  login(email,password)
  console.log(email,password)
})