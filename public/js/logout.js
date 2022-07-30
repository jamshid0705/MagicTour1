document.querySelector('.nav__el--logout').addEventListener('click',async(e)=>{
  try {
    const res=await axios({
      method:"POST",
      url:"http://localhost:8000/logout",
      data:{}
    })

    window.setTimeout(()=>{
      alert('Siz tizimdan chiqdingiz !')
      location.assign('/login')
    })
    console.log(res)
  } catch (error) {
    alert(err.response.data.message)
  }
  
})