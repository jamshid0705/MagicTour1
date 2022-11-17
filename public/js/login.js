// import axios from 'axios';
// const axios = require('axios');

const enterSystem=async(email,password)=>{
  const res=await axios({
    method:'POST',
    url:'http://localhost:8000/api/v1/users/signin',
    data:{
      email:email,
      password:password
    }
  })
    if(res.status==200){
      alert('You have entered System Succesful ');
      window.setTimeout(()=>{
        location.assign('/')
      },1000)
    }
    console.log(res)
}

document.querySelector('.form').addEventListener('submit',(e)=>{
  e.preventDefault();
  const email=document.querySelector('#email').value;
  const password=document.querySelector('#password').value
  enterSystem(email,password)
  console.log(email,password)
})

