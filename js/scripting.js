export var input = Array.from(document.getElementsByTagName('input'));
var textarea = Array.from(document.getElementsByTagName('textarea'));
var contact_form = document.getElementById('contact-form');
var login_form = document.getElementById('login-form');
var signup_form = document.getElementById('signup-form');
var data = localStorage.getItem("database");
var sL = Array.from(document.querySelectorAll("a.switch-link"));
var user = localStorage.getItem('user');
import {showForm} from './functions.js'
import {setFocusFor} from './functions.js'
import {setBlurFor} from './functions.js'
import {setSuccessFor} from './functions.js'
import {setErrorFor} from './functions.js'
import {alertMessage} from './functions.js'
import {chngPgTLggdIn} from './functions.js'
import {createAddBlogFrom} from './functions.js'
import {checkFileType} from './functions.js'
import {showPreview} from './functions.js'
import {chkBlgCntnt} from './functions.js'
import {validateForm} from './functions.js'
import {vdtemail} from './functions.js'
chngPgTLggdIn(user);
if (data == null) {
  var datas = {queries: [],users: [],blogs: [],skills: [],portifolios: [],admins: [],log: []}; 
  localStorage.setItem("database", JSON.stringify(datas));
}
chkBlgCntnt();
contact_form.addEventListener('submit',e=>{
  e.preventDefault();
  var ins = Array.from(contact_form.querySelectorAll('input'));
  var __ta = contact_form.querySelector('textarea');
  ins.push(__ta);
  let data = {};
     ins.forEach(inputs=>{
        Object.assign(data,{ [inputs.name]:inputs.value.trim()});
      })
  validateForm(contact_form,ins,data);
  
})
signup_form.addEventListener('submit',e=>{
  e.preventDefault();
  var ins = Array.from(signup_form.querySelectorAll('input'));
  let data = {};
     ins.forEach(inputs=>{
        Object.assign(data,{ [inputs.name]:inputs.value.trim()});
      })
  validateForm(signup_form,ins,data);
  
})
login_form.addEventListener('submit',e=>{
  e.preventDefault();
  var user = localStorage.getItem('user');
  if (user == null) {
    var ins = Array.from(login_form.querySelectorAll('input'));
    let data = {};
     ins.forEach(inputs=>{
        Object.assign(data,{ [inputs.name]:inputs.value.trim()});
      })
    validateForm(login_form,ins,data);
  }else{
    alertMessage("it seems like you are logged in firstly logout to proceed");
  }
  
})
input.forEach(inp=>{
  inp.addEventListener('focus',e=>{
    inp.parentNode.classList.add('focus');
  })
})
input.forEach(inp=>{
  inp.addEventListener('blur',e=>{
    inp.parentNode.classList.remove('focus');
    if (inp.value == "") {
      setErrorFor(inp,"please fill out this field");
    }else{
      setSuccessFor(inp);
    }
  })
  if (inp.id == 'emailsignup') {
    inp.addEventListener('keyup',e=>{
      vdtemail(inp.value,inp);
    })
  }
})
textarea.forEach(ta=>{
  ta.addEventListener('focus',e=>{
    ta.parentNode.classList.add('focus');
  })
})
textarea.forEach(ta=>{
  ta.addEventListener('blur',e=>{
    ta.parentNode.classList.remove('focus');
    if (ta.value == "") {
      setErrorFor(ta,"please fill out this field");
    }else{
      setSuccessFor(ta);
    }
  })
})



sL.forEach(swl=>{
  swl.addEventListener("click",e=>{
    e.preventDefault();
      showForm(swl.id);
  })
})
