require("@babel/core");
var $jqtH7$axios = require("axios");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}


const $70af9284e599e604$var$enterSystem = async (email, password)=>{
    const res = await (0, ($parcel$interopDefault($jqtH7$axios)))({
        method: "POST",
        url: "http://localhost:8000/api/v1/users/signin",
        data: {
            email: email,
            password: password
        }
    });
    if (res.status == 200) {
        alert("You have entered System Succesful ");
        window.setTimeout(()=>{
            location.assign("/");
        }, 1000);
    }
    console.log(res);
};
var $70af9284e599e604$export$2e2bcd8739ae039 = $70af9284e599e604$var$enterSystem;


document.querySelector(".form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    (0, $70af9284e599e604$export$2e2bcd8739ae039)(email, password);
    console.log(email, password);
});


//# sourceMappingURL=bundle.js.map
