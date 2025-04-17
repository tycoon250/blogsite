var input,textarea,dec,val,source,found,pattern,eml,v,passval,activepg,database,i,auser,functions
sessionStorage.setItem('val',0)
const socket = io('https://myblosite.onrender.com');

// Listen for the 'connect' event
socket.on('connect', () => {
  console.log('Connected to the server');
});
let d = socket.emit('message', 'Hello, server!');
if (d) {
  console.log('Message sent successfully!');
} else {
  console.log('Failed to send message');
}
socket.on('acknowledge', (data) => {
  console.log(`Received acknowledgement from server: ${data}`);
});
export function validateForm(form,inputs,formdata) {

  val = 1;
  if (form.name == "contact_form") {
    inputs.forEach(inp=>{
      if (inp.name == "firstname") {
        if (inp.value == "") {
          setErrorFor(inp,"firstname is required");
          val = 0;
        }
      }else if (inp.name == "lastname") {
        if (inp.value == "") {
          setErrorFor(inp,"lastname is required");
          val = 0;
        }
      }else if (inp.name == "email") {
        if (inp.value == "") {
          setErrorFor(inp,"please enter your email");
          val = 0;
        }
      }else if (inp.name == "subject") {
        if (inp.value == "") {
          setErrorFor(inp,"please enter your subject");
          val = 0;
        }
      }else if (inp.name == "message") {
        if (inp.value == "") {
          setErrorFor(inp,"your message is required!");
          val = 0;
        }
      }
    })
    if(val == 1){
        inputs.forEach(inm=>{
          setBlurFor(inm);
        })
        sendmessage(inputs,'message',form,formdata);
      }
  }else if (form.name =='signup-form') {
    inputs.forEach(inp=>{
      if (inp.name == "firstname") {
          if (inp.value == "") {

            setErrorFor(inp,"firstname is required");
            val = 0;
          }else{
            setSuccessFor(inp);
          }
        }else if (inp.name == "lastname") {
          if (inp.value == "") {

            setErrorFor(inp,"lastname is required");
            val = 0;
          }else{
            setSuccessFor(inp);
          }
        }else if (inp.name == "email") {
          if (inp.value == "") {

            setErrorFor(inp,"please enter your email");
            val = 0;
          }else{
            val = vdtemail(inp.value,inp);
          }
        }else if (inp.name == "password") {
          if (inp.value == "") {

            setErrorFor(inp,"please enter your password");
            val = 0;
          }else{
            passval = inp.value;
            setSuccessFor(inp);
          }
        }else if (inp.name == "confirm") {
          if (inp.value == "") {

            setErrorFor(inp,"confirm your password");
            val = 0;
          }else if (inp.value != passval) {
            setErrorFor(inp,"passwords do not match");
            val = 0;
          }else{
            setSuccessFor(inp);
          }
        }   
    })
     if(val == 1){
        inputs.forEach(inm=>{
          setBlurFor(inm);
        })
        
        sessionStorage.setItem('val',0);
        sendmessage(inputs,'signup',form,formdata);
      }
  }else if (form.name == 'login-form') {
    inputs.forEach(inp=>{
      if (inp.name == "email") {
            if (inp.value == "") {
              setErrorFor(inp,"enter your email");
              val = 0;
            }
          }else if (inp.name == "password") {
            if (inp.value == "") {
              setErrorFor(inp,"password is required");
              val = 0;
            }
      }

    })
    if(val == 1){
        inputs.forEach(inm=>{
          setBlurFor(inm);
        })
        sendmessage(inputs,'login',form,formdata);
      }
  }else if (form.name == 'admin-login-form') {
    inputs.forEach(inp=>{
      if (inp.name == "username") {
            if (inp.value == "") {
              setErrorFor(inp,"enter your username");
              val = 0;
            }
          }else if (inp.name == "password") {
            if (inp.value == "") {
              setErrorFor(inp,"password is required");
              val = 0;
            }
      }

    })
    if(val == 1){
        sendmessage(inputs,'adminlogin',form,formdata);
      }
  }else if(form.name == "blog_form"){
    inputs.forEach(inp=>{
      if (inp.name == "title") {
        if (inp.value == "") {
          setErrorFor(inp,"enter a blog title");
          val = 0;
        }
      }else if (inp.name == "image") {
        if (inp.value == "") {
          setErrorFor(inp,"select an image");
          val = 0;
        }else{
          dec = checkFileType(inp)[0];
          if (dec == 'image') {
            val = 1;
          }else{
            val = 0;
          }
        }
      }else if (inp.name == "description") {
        if (inp.value == "") {
          setErrorFor(inp,"add a blog description");
          val = 0;
        }
      }

    })
    if(val == 1){
        inputs.forEach(inm=>{
          setBlurFor(inm);
        })
        sendmessage(inputs,'blog',form,formdata);
      }
  }
}
export function vdtemail(value,input) {
   pattern =  /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if(input.value.match(pattern)){
        fetch('https://myblosite.onrender.com/api/checkEmail',{
          mode: 'cors',
          method: "POST",
          body : JSON.stringify({email:input.value.trim()}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'
          }
        }).then(response => response.json())
          .then(data => {
            if (data.success == true) {
              setErrorFor(input,"the entered email is in use!");
              sessionStorage.setItem('val',0)

            }else{
              setSuccessFor(input);
              sessionStorage.setItem('val',1)
              
            }
        }).catch(error=>{
          alertMessage(error);
        })       
  }else{
    setErrorFor(input,"try to use a valid email address");
    sessionStorage.setItem('val',0)
  }
  return sessionStorage.getItem('val')
}
export function sendmessage(inputs,type,form,formdata) {
  if (type == 'message') {
    var values = {};
    inputs.forEach(inp=>{
      if (inp.name == "firstname") {
          if (inp.value != "") {
            Object.assign(values,{firstname: inp.value});
          }
        }else if (inp.name == "lastname") {
          if (inp.value != "") {
            Object.assign(values,{lastname: inp.value});
          }
        }else if (inp.name == "email") {
          if (inp.value != "") {
            Object.assign(values,{email: inp.value});
          }
        }else if (inp.name == "subject") {
          if (inp.value != "") {
            Object.assign(values,{subject: inp.value});
          }
        }if (inp.name == "message") {
          if (inp.value != "") {
            Object.assign(values,{message: inp.value});
          }
        }
    })
    var data = JSON.parse(localStorage.getItem("database"));
    Object.assign(values,{status: "new"});
    data.queries.push(values);
    localStorage.database = JSON.stringify(data);
    fetch('https://myblosite.onrender.com/api/addquery/',{
      mode: 'cors',
      method: "POST",
      body : JSON.stringify(formdata),
      headers: {
        "content-type": "application/json",
        'accept': '*/*'

      }
    }).then(response => response.json())
      .then(data => {
        alertMessage(data.message);
    }).catch(error=>{
      alertMessage(error);
    })
    form.reset();
  }else if (type == 'signup') {
    var values = {};
     inputs.forEach(inp=>{
      if (inp.name == "firstname") {
          if (inp.value != "") {
            Object.assign(values,{firstname: inp.value});

          }else{
              setErrorFor(inp,"fill this field");
            }
        }else if (inp.name == "lastname") {
          if (inp.value != "") {
            Object.assign(values,{lastname: inp.value});
          }else{
              setErrorFor(inp,"fill this field");
            }
        }else if (inp.name == "email") {
          if (inp.value != "") {
            Object.assign(values,{email: inp.value});
          }else{
              setErrorFor(inp,"fill this field");
            }
        }else if (inp.name == "password") {
          if (inp.value != "") {
            Object.assign(values,{password: inp.value});
          }else{
              setErrorFor(inp,"fill this field");
            }
        }
    })
    fetch('https://myblosite.onrender.com/api/signup',{
      mode: 'cors',
      method: "POST",
      body : JSON.stringify(formdata),
      headers: {
        "content-type": "application/json",
        'accept': '*/*'

      }
    }).then(response => response.json())
      .then(data => {
        if (data.success == false) {
          alertMessage(data.message);

        }else{
          alertMessage(data.message);          
          form.reset();
        }
    }).catch(error=>{
      alertMessage(error);
    })
   
  }else if(type == 'login'){
    var values = {};
      inputs.forEach(inp=>{
          if (inp.name == "email") {
            if (inp.value != "") {
                Object.assign(values,{email: inp.value});
            }else{
              setErrorFor(input,"fill this field");
            }
          }else if (inp.name == "password") {
            if (inp.value != "") {
                Object.assign(values,{password: inp.value});
            }
          }
      })
        fetch('https://myblosite.onrender.com/api/login',{
        mode: 'cors',
        method: "POST",
        body : JSON.stringify(formdata),
        headers: {
          "content-type": "application/json",
          'accept': '*/*'

        }
        }).then(response => response.json())
          .then(data => {
            if (data.success == false) {
              alertMessage("incorrect email or password");
            }else if(data.success){
              localStorage.setItem("user",JSON.stringify(data));
              alertMessage("you have been successfully logged in");
              form.reset();
              chngPgTLggdIn(formdata);
              chkBlgCntnt();
            }
        }).catch(error=>{
          alertMessage(error);
        })
      
  }else if(type == 'adminlogin'){
    var values = {};
      inputs.forEach(inp=>{
          if (inp.name == "username") {
            if (inp.value != "") {
                Object.assign(values,{username: inp.value});
            }else{
              setErrorFor(input,"fill this field");
            }
          }else if (inp.name == "password") {
            if (inp.value != "") {
                Object.assign(values,{password: inp.value});
            }
          }
      })
        fetch('https://myblosite.onrender.com/api/adminlogin',{
        mode: 'cors',
        method: "POST",
        body : JSON.stringify(values),
        headers: {
          "content-type": "application/json",
          'accept': '*/*'

        }
        }).then(response => response.json())
          .then(data => {
            if (data.success == false) {
              alertMessage("incorrect username or password");
            }else if(data.success){
              alertMessage("you have been successfully logged in");
               inputs.forEach(inp=>{
                setBlurFor(inp)
               })
              form.reset();
              localStorage.setItem("admin",JSON.stringify(data));
              window.location.href = 'dashboard.html'
            }
        }).catch(error=>{
          alertMessage(error);
        })
      
  }else if (type == 'blog') {
    var values = {};
      inputs.forEach(inp=>{
          if (inp.name == "title") {
            if (inp.value != "") {
                Object.assign(values,{title: inp.value});
            }else{
              setErrorFor(input,"fill this field");
            }
          }else if (inp.name == "image") {
            if (inp.value != "") {
              source = form.querySelector('img.preview-img').src;
                Object.assign(values,{image: source});
            }
          }else if (inp.name == "description") {
            if (inp.value != "") {
                Object.assign(values,{description: inp.value});
            }
          }
      })
      var data = JSON.parse(localStorage.getItem("database"));
      Object.assign(values,{blog_type: "user_blog"});
      i = getdata('user');
      if (i == null) {
        i = getdata('admin');
      }
      Object.assign(values,{token: i});
      values = JSON.stringify(values)
      var leFull = document.querySelector('div.shade');
      let body = document.getElementById('body');
      var divs = Array.from(document.querySelectorAll('div.content'));
      
       fetch('https://myblosite.onrender.com/api/addblog',{
        mode: 'cors',
        method: "POST",
        body : values,
        headers: {
          "content-type": "application/json",
          'accept': '*/*'

        }
        }).then(response => response.json())
          .then(data => {
            if (data.success) {
              if (form.classList[2] != 'adminform') {
                closeTab(body,leFull,divs);
                chkBlgCntnt();
              }
              alertMessage(data.message);
            }else{
              alertMessage(data.message);
            }
          }).catch(error=>{
          alertMessage(error);
        })
  }
}
export function showForm(form) {
  var forms = Array.from(document.querySelectorAll("div.user-form"));
  if (form == "signup") {
    forms[0].classList.add('left-100');
    forms[1].classList.add('left-100');
    forms[0].classList.remove('left-0');
    forms[1].classList.remove('left-0');
  }else if (form == "login"){
    forms[0].classList.add('left-0');
    forms[1].classList.add('left-0');
    forms[0].classList.remove('left-100');
    forms[1].classList.remove('left-100');
  }
}
export function setFocusFor(input) {
  const rep = input.parentElement;
  rep.classList.remove('error');
  rep.classList.remove('blur');
  rep.classList.add('focus');
  rep.classList.remove('success');
  const small = rep.querySelector('small');
  small.classList.add('hidden');
}
export function setBlurFor(input) {
  const rep = input.parentElement;
  rep.classList.remove('focus');
  rep.classList.remove('error');
  rep.classList.remove('success');
  const small = rep.querySelector('small');
  let _err = rep.querySelector('span').childNodes[1];
  let _succ = rep.querySelector('span').childNodes[3];
   _err.classList.add('hidden');
  _succ.classList.add('hidden');
  small.classList.add('hide');
}
export function setSuccessFor(input) {
  const rep = input.parentElement;
  // rep.classList.remove('focus');
  rep.classList.remove('error');
  rep.classList.add('success');
  let _err = rep.querySelector('span').childNodes[1];
  let _succ = rep.querySelector('span').childNodes[3];
  _err.classList.add('hidden');
  _succ.classList.remove('hidden');
  const small = rep.querySelector('small');
  small.classList.add('hide');
}
export function setErrorFor(input,message) {
  const rep = input.parentElement;
  const small = rep.querySelector('small');
  small.classList.remove('hide');
  small.innerText = message;
  let _err = rep.querySelector('span').childNodes[1];
  let _succ = rep.querySelector('span').childNodes[3];
  _err.classList.remove('hidden');
  _succ.classList.add('hidden');
  rep.classList.remove('success');
  rep.classList.add('error');

}
export function alertMessage(message) {
  var leFull = document.createElement('div');
  let body = document.getElementById('body');
  body.appendChild(leFull);
  var divs = Array.from(document.querySelectorAll('div.content'));
  divs.forEach(div=>{
    div.classList.add("blur");
  })
  leFull.className = "p-f w-100 h-700p bc-tr-black t-0 zi-10000";
  leFull.innerHTML = `<div class="w-300p h-200p p-20p bsbb bc-white cntr zi-10000"><div class="head w-100 h-40p p-5p bsbb bb-1-s-dg"><span class="fs-18p black capitalize igrid center h-100 verdana">message</span><span class="right igrid  h-100 close hover-2"><svg version="1.1" class="w-30p h-30p" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g></svg></span></div><div class="body w-100 h-a p-5p grid center mt-10p"><span class="fs-15p dgray capitalize left">${message}</span></div></div>`;
  body.classList.add('ovh');
  var close = Array.from(document.querySelectorAll("span.close"));
  close.forEach(cls=>{
    cls.addEventListener("click",e=>{
      e.preventDefault();
      closeTab(body,leFull,divs);
    })
  })

}
export function closeTab(parent,element,divs) {
  try{
    parent.removeChild(element);

  }catch{

  }
  divs.forEach(div=>{
    div.classList.remove("blur");
  })
  body.classList.remove('ovh');
}
export function chngPgTLggdIn(user) {
  var blogop = document.querySelector("div.blogop");
  var addblogbutton = document.createElement("div");
  if (user != null) {
    var login_butt_hol = document.querySelector('li.login-butt-hol');
    // change the navigation button
    login_butt_hol.innerHTML = `<a href="" class="bc-black login-butt white td-none pt-7p pb-10p pl-15p pr-15p">logout</a>`;
    document.querySelector('a.login-butt').addEventListener("click",e=>{
        e.preventDefault();
        localStorage.removeItem("user");
        alertMessage("you have been successfully logged out !");
        chngPgTLggdIn(null);
        chkBlgCntnt();
    })
    //add an add blog button
    blogop.appendChild(addblogbutton);
    addblogbutton.className = "w-120p h-100 iblock right m-10p hover-2";
    addblogbutton.innerHTML = `<span class="  fs-15p capitalize right black block  h-a bsbb p-5p  br-50 w-30p h-30p">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 55 55" style="enable-background:new 0 0 55 55;" xml:space="preserve">
                <g>
                  <path d="M49,8.5v-8H0v47h7v7h48v-46H49z M2,45.5v-43h45v6H7v37H2z M53,52.5H9v-5v-37h40h4V52.5z"/>
                  <path d="M42,30.5H32v-10c0-0.553-0.447-1-1-1s-1,0.447-1,1v10H20c-0.553,0-1,0.447-1,1s0.447,1,1,1h10v10c0,0.553,0.447,1,1,1   s1-0.447,1-1v-10h10c0.553,0,1-0.447,1-1S42.553,30.5,42,30.5z"/>
                </g>
              </svg>
            </span>
            <span class="  fs-15p capitalize left black h-a bsbb p-5p">
              add yours
            </span>`;
    addblogbutton.addEventListener('click',e=>{
      createAddBlogFrom();
    })
  }else{
    // change the navigation button
    var login_butt_hol = document.querySelector('li.login-butt-hol');
    // change the navigation button
    login_butt_hol.innerHTML = `<a href="#login" class="bc-theme white td-none pt-7p pb-10p pl-15p pr-15p">login</a>`;
    // remove the add bolg button
    blogop.innerHTML = `<div class="w-100p h-100 iblock  m-10p">
            <span class="  fs-15p capitalize right black block h-a bsbb p-5p bc-gray  br-50 w-30p h-30p">
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="w-20p h-20p"><g class="style-scope yt-icon"><path d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z" class="style-scope yt-icon"></path></g></svg>
            </span>
            <span class="  fs-15p capitalize left black h-a bsbb p-5p">
              latest
            </span>
          </div>`;
  }
}
export function createAddBlogFrom() {
  
  var leFull = document.createElement('div');
  let body = document.getElementById('body');
  body.appendChild(leFull);
  var divs = Array.from(document.querySelectorAll('div.content'));
  divs.forEach(div=>{
    div.classList.add("blur");
  })
  leFull.className = "p-f w-100 h-100 bc-tr-black t-0 p-40p bsbb zi-10000 shade";
  leFull.innerHTML = `<div class="w-400p h-90 p-20p bsbb bc-white cntr zi-10000 card-3 p-r"><div class="head w-100 h-70p p-5p bsbb bb-1-s-dg"><span class="fs-18p black capitalize igrid center h-100 verdana">add your own blog !</span><span class="right igrid  h-100 close hover-2"><svg version="1.1" class="w-30p h-30p" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g></svg></span></div><div class="body w-100 h-a p-5p grid center mt-10p"><div class="text w-100 h-a bsbb bsbb p-r ">
        <span class="right w-100 h-100  p-r">
          <div class="w-100 h-100 p-10p bsbb">
            <form method="post" name="blog_form" class="p-10p bsbb" id="blog-form">
              <div class="w-100 h-60p mt-10p mb-10p p-10p bsbb">
                <div class="p-r w-100 igrid mr-10p left parent p-r">
                  <input type="text" name="title" placeholder="Title" class="p-10p no-outline bsbb b-1-s-dgray bc-white">
                  <span class="p-a r-0 mt-10p mr-5p">
                    <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#FF0000"/>
                      <path d="M11.0717 5.27273L10.8757 11.3281H9.12429L8.92827 5.27273H11.0717ZM9.99787 14.1236C9.69389 14.1236 9.43253 14.0156 9.21378 13.7997C8.99787 13.5838 8.88991 13.3224 8.88991 13.0156C8.88991 12.7145 8.99787 12.4574 9.21378 12.2443C9.43253 12.0284 9.69389 11.9205 9.99787 11.9205C10.2905 11.9205 10.5476 12.0284 10.7692 12.2443C10.9936 12.4574 11.1058 12.7145 11.1058 13.0156C11.1058 13.2202 11.0533 13.4062 10.9482 13.5739C10.8459 13.7415 10.7109 13.875 10.5433 13.9744C10.3786 14.0739 10.1967 14.1236 9.99787 14.1236Z" fill="white"/>
                    </svg>
                    <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#68D753"/>
                      <line x1="6.38765" y1="8.96481" x2="9.54712" y2="12.8401" stroke="white"/>
                      <line x1="8.80605" y1="12.7273" x2="14.8872" y2="6.64614" stroke="white"/>
                    </svg>
                  </span>
                  <small class="red verdana hide ml-5p">error mssg</small>
                </div>
              </div>
              <div class="w-100 h-100p mt-10p mb-10p p-10p bsbb">
                <div class="p-r w-40 igrid mr-10p left parent ovh h-100">
                  <div class="p-10p no-outline bsbb b-1-s-dgray bc-white w-100 mt-10p h-40p hover-2 dgray capitalize fs-14p">add image</div>
                  <input type="file" name="image" placeholder="Thumbnail" class="p-a mt-10p op-0 hover-2 h-40p w-100">
                  <span class="p-a r-0 mt-20p mr-5p w-20p h-20p zi-10000">
                    <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#FF0000"/>
                      <path d="M11.0717 5.27273L10.8757 11.3281H9.12429L8.92827 5.27273H11.0717ZM9.99787 14.1236C9.69389 14.1236 9.43253 14.0156 9.21378 13.7997C8.99787 13.5838 8.88991 13.3224 8.88991 13.0156C8.88991 12.7145 8.99787 12.4574 9.21378 12.2443C9.43253 12.0284 9.69389 11.9205 9.99787 11.9205C10.2905 11.9205 10.5476 12.0284 10.7692 12.2443C10.9936 12.4574 11.1058 12.7145 11.1058 13.0156C11.1058 13.2202 11.0533 13.4062 10.9482 13.5739C10.8459 13.7415 10.7109 13.875 10.5433 13.9744C10.3786 14.0739 10.1967 14.1236 9.99787 14.1236Z" fill="white"/>
                    </svg>
                    <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#68D753"/>
                      <line x1="6.38765" y1="8.96481" x2="9.54712" y2="12.8401" stroke="white"/>
                      <line x1="8.80605" y1="12.7273" x2="14.8872" y2="6.64614" stroke="white"/>
                    </svg>
                  </span>
                  <small class="red verdana hide ml-5p">error mssg</small>
                </div>
                <div class="p-r w-40 igrid  right h-100 parent">
                  <div type="text" name="subject" class="no-outline previewpanel bsbb b-1-s-dgray bc-white w-100 h-100p mt--20p "><span class="w-100 h-100 p-10p center verdana dgray fs-13p capitalize">preview</span></div>
                </div>
              </div>
              <div class="w-100 h-60p mt-10p mb-10p p-10p bsbb">
                <div class="p-r w-100 igrid mr-10p left parent">
                  <textarea rows="4" cols="50" placeholder="description" name="description" class="p-10p no-outline bsbb b-1-s-dgray bc-white"></textarea>
                  <span class="p-a r-0 mt-10p mr-5p">
                    <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#FF0000"/>
                      <path d="M11.0717 5.27273L10.8757 11.3281H9.12429L8.92827 5.27273H11.0717ZM9.99787 14.1236C9.69389 14.1236 9.43253 14.0156 9.21378 13.7997C8.99787 13.5838 8.88991 13.3224 8.88991 13.0156C8.88991 12.7145 8.99787 12.4574 9.21378 12.2443C9.43253 12.0284 9.69389 11.9205 9.99787 11.9205C10.2905 11.9205 10.5476 12.0284 10.7692 12.2443C10.9936 12.4574 11.1058 12.7145 11.1058 13.0156C11.1058 13.2202 11.0533 13.4062 10.9482 13.5739C10.8459 13.7415 10.7109 13.875 10.5433 13.9744C10.3786 14.0739 10.1967 14.1236 9.99787 14.1236Z" fill="white"/>
                    </svg>
                    <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#68D753"/>
                      <line x1="6.38765" y1="8.96481" x2="9.54712" y2="12.8401" stroke="white"/>
                      <line x1="8.80605" y1="12.7273" x2="14.8872" y2="6.64614" stroke="white"/>
                    </svg>
                  </span>
                  <small class="red verdana hide ml-5p">error mssg</small>
                </div>
              </div>
              <div class="w-a  h-60p mt-10p p-r right mb-10p p-10p bsbb">
                <div class="w-100 igrid">
                  <span class="center iblock">
                    <button class="bc-theme p-10p b-none w-150p">
                      <span class="verdana white fs-15p capitalize">post</span>
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </span>
      </div></div></div>`;
  body.classList.add('ovh');
  var blogForm = document.getElementById('blog-form');
  input = Array.from(document.getElementsByTagName('input'));
  textarea = blogForm.querySelector("textarea");
  input.push(textarea);
  input.forEach(inp=>{
    inp.addEventListener('focus',e=>{
      inp.parentNode.classList.add('focus');
    })
  })
  input.forEach(inp=>{
    inp.addEventListener('blur',e=>{
      inp.parentNode.classList.remove('focus');
      if (inp.type != 'file' && inp.value == "") {
        setErrorFor(inp,"please fill out this field");
      }else if (inp.type != 'file' && inp.value != '') {
        setSuccessFor(inp);
      }
    })
  })
  input.forEach(inp=>{
    inp.addEventListener('change',e=>{
      if (inp.type == 'file' && inp.value == '') {
        setErrorFor(inp,"choose an image");
        return 0;
      }else if (inp.type == 'file' && inp.value != '') {
        dec = checkFileType(inp)[0];
        if (dec == 'image') {
          setSuccessFor(inp);
          showPreview(inp,document.querySelector('div.previewpanel'),"new");
          return 1;
        }else{
          setErrorFor(inp,'only images are allowed');
          document.querySelector('div.previewpanel').innerHTML = `<span class="w-100 h-100 p-10p center verdana dgray fs-13p capitalize">preview</span>`;
          return 0;
        }

      }
    })
  })
  var close = document.querySelector("span.close");
  blogForm.addEventListener("submit",e=>{
    e.preventDefault();
    validateForm(blogForm,input);
  })
  close.addEventListener("click",e=>{
    e.preventDefault();
    closeTab(body,leFull,divs);
  })

}
export function checkFileType(input) {
  var type = input.files[0].type.split(/\//);
  return type;
}
export function showPreview(input,preview,type,srcs,from) {
  if (type == "new") {
    const reader = new FileReader();
    const file = input.files[0];

    reader.addEventListener("load", () => {
        if (file.size > 800000) {
          let img = document.createElement('img');
          preview.innerHTML = null;
          preview.appendChild(img);
          img.className = "w-100 h-100 contain preview-img";
          // img.classList.add("hidden");
          img.setAttribute("src",reader.result);
          let canvas = document.createElement("canvas");
          canvas.setAttribute("hidden","");
          canvas.width = img.naturalWidth/10;
          canvas.height = img.naturalHeight/10;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.naturalWidth/10, img.naturalHeight/10);
          preview.appendChild(canvas);
          console.log(canvas)
          // img.src = canvas.toDataURL();
          // console.log(reader.result)
          //  preview.innerHTML = `<img src="${img.src}" class="w-100 h-100 contain preview-img">`;
        }else{
          console.log(preview)
           preview.innerHTML = `<img src="${reader.result}" class="w-100 h-100 contain preview-img">`;
        }
    });
    reader.readAsDataURL(file);
  }else{
     preview.innerHTML = `<img src="${srcs}" class="w-100 h-100 contain preview-img">`;
  }
}
export function chkBlgCntnt(){
  var blogsholder = document.querySelector('div.blogsholder');
  async function fetchUrl(url) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({token: getdata('user')}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
        if (data.success == true) {
          showd(data);

        }else{
          alertMessage(data.message)
        }
      } catch (error) {
        alertMessage(error);
      }
  }
  fetchUrl("https://myblosite.onrender.com/api/viewblogs");
  function showd(blogs) {
      blogsholder.innerHTML = "";
      i = 0;
      blogs.message.forEach(blg=>{
        let div = document.createElement('div');
        div.className = "text w-300p h-450p bsbb p-r ovh bsbb bc-white b-1-s-dgray m-20p igrid blog"
        blogsholder.appendChild(div)
        div.innerHTML = `
              <div class="w-100 h-200p bc-black iblock">
                <img src="${blg.image}" class="w-100 h-100 cover">
              </div>
              <div class="w-100 h-30p p-10p bsbb flex jc-sb">
                <span class="w-100p h-100 iblock left verdana capitalize p-r">
                  <span class="capitalize fs-12p dgray p-r w-20p h-20p ovh center-2">
                    <svg version="1.1" class="w-20p h-20p p-r hover-2 like p-a tr-0-3" id="${blg._id}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 51.997 51.997" style="enable-background:new 0 0 51.997 51.997;" xml:space="preserve">
                      <g>
                        <path d="M51.911,16.242C51.152,7.888,45.239,1.827,37.839,1.827c-4.93,0-9.444,2.653-11.984,6.905
                            c-2.517-4.307-6.846-6.906-11.697-6.906c-7.399,0-13.313,6.061-14.071,14.415c-0.06,0.369-0.306,2.311,0.442,5.478
                            c1.078,4.568,3.568,8.723,7.199,12.013l18.115,16.439l18.426-16.438c3.631-3.291,6.121-7.445,7.199-12.014
                            C52.216,18.553,51.97,16.611,51.911,16.242z M49.521,21.261c-0.984,4.172-3.265,7.973-6.59,10.985L25.855,47.481L9.072,32.25
                            c-3.331-3.018-5.611-6.818-6.596-10.99c-0.708-2.997-0.417-4.69-0.416-4.701l0.015-0.101C2.725,9.139,7.806,3.826,14.158,3.826
                            c4.687,0,8.813,2.88,10.771,7.515l0.921,2.183l0.921-2.183c1.927-4.564,6.271-7.514,11.069-7.514
                            c6.351,0,11.433,5.313,12.096,12.727C49.938,16.57,50.229,18.264,49.521,21.261z"/>
                      </g>
                    </svg>
                    <svg version="1.1" class="w-20p h-20p p-r hover-2 unlike tr-0-3 p-a ml-200" id="${blg._id}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                      <path fill="#5285d1" d="M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543
                        c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503
                        c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z"/>
                    </svg>
                  </span>
                  <font class="ml-5p p-a t-0 ml-25p ">${blg.likes.length}</font>
                </span>
                <span class="w-100p h-100 iblock right verdana capitalize" ><font class="p-5p">${blg.comments.length}</font><font class="capitalize fs-12p dgray">Comments</font></span>
              </div>
              <div class="w-100 h-30p p-10p bsbb"><span class="w-100 h-100 fs-17p bold verdana capitalize">${blg.title}</span><span class="w-100 h-100 fs-11p mt-5p dgray verdana capitalize block">a blog by ${blg.ownr_name}.</span></div>
              <span class=" fs-15p left black h-a bsbb w-100 right p-20p">
                  <div class="fs-14p  w-100 h-120p ovys left scroll-3">
                      ${ellipsis(blg.description, 100)}
                  </div>
                  <div class=" h-40p mt-5p w-100 p-5p bsbb block">
                    <div class="w-50p h-100 right hover-2 center-2 p-10p bsbb">
                      <span class="w-a h-100 bsbb fs-15p bsbb capitalize theme viewlink" id="${blg._id}">view</span>
                      <span class="w-a h-100 bsbb fs-15p bsbb capitalize theme">
                        <svg version="1.1" class="w-20p h-20p theme" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                          <g>
                            <polyline fill="none" class="theme" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="27,15 44,32 
                              27,49   "/>
                          </g>
                        </svg>
                        </span>
                    </div>
                  </div>
                </span>
            `
          var like = Array.from(document.querySelectorAll('svg.like'));
          checklikability(like[i],blg.lstatus);
          i++;
      })

    var like = Array.from(document.querySelectorAll('svg.like'));
    var unlike = Array.from(document.querySelectorAll('svg.unlike'));
    like.forEach(lk=>{
      lk.addEventListener('click',f=>{
        f.preventDefault();
        auser = getdata('user');
        if (auser == null) {
          auser = getdata('admin')
          if (auser != null) {
            addlike(lk);
          }else{
            alertMessage('you must login first in order to like a blog');
          }
        }else{
          addlike(lk);
        }
      })
    })
    unlike.forEach(lk=>{
      lk.addEventListener('click',f=>{
        f.preventDefault();
        auser = getdata('user');

        if (auser == null) {
          auser = getdata('admin')
          if (auser != null) {
            addlike(lk);
          }else{
            alertMessage('you must login first in order to like a blog');
          }
        }else{
          addlike(lk);
        }
      })
    })
      var viewlink = Array.from(document.querySelectorAll('span.viewlink'));
      viewlink.forEach(s=>{
        s.addEventListener('click',e=>{
          e.preventDefault();
          showBlog(s.id,'user');
        })
      })
  }
}
export function checklikability(lkbs,blog) {
  auser = getdata('user');

  if (auser != null) {
    if (blog == 'true') {
      lkbs.parentNode.childNodes[1].classList.add('ml--200');
      lkbs.parentNode.childNodes[3].classList.remove('ml-200');
    }else{
      lkbs.parentNode.childNodes[1].classList.remove('ml--200');
      lkbs.parentNode.childNodes[3].classList.add('ml-200');
    }

  }

}
export function addlike(like){
  auser = getdata('user');
  if (auser == null) {
    auser = getdata('admin')
  }
  ftch("https://myblosite.onrender.com/api/addlike",like.id,auser);
  async function ftch(url,blogid,userinfo) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({id : blogid,data:{liked: true},token: userinfo}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const liked = await response.json();
        if (liked.success == false) {
          like.parentNode.parentNode.childNodes[3].innerText = parseInt(like.parentNode.parentNode.childNodes[3].innerText)-1
          like.parentNode.childNodes[1].classList.remove('ml--200');
          like.parentNode.childNodes[3].classList.add('ml-200');
        }else{
          like.parentNode.parentNode.childNodes[3].innerText = parseInt(like.parentNode.parentNode.childNodes[3].innerText)+1
          like.parentNode.childNodes[1].classList.add('ml--200');
          like.parentNode.childNodes[3].classList.remove('ml-200');
        }
        
      } catch (error) {
      }
  }
  
}
export function chagecontent(newactive,prevactive) {
  newactive.classList.add('active');
  prevactive.classList.remove('active');
  newactive.classList.remove('ml-100');
  newactive.classList.remove('ml--100');
  prevactive.classList.add('ml--100');
  swtchcntnt(newactive);
}
export function swtchcntnt(newdiv) {
  var content = newdiv.id;
  database = JSON.parse(localStorage.getItem('database'));

  switch(content){
    case 'home':
      showcontent("home",newdiv);
      break;
    case 'users':
      showcontent("database.users",newdiv);
      break;
    case 'myblogs':
      showcontent("database.blogs",newdiv);
      break;
    case 'usersblogs':
      showcontent("database.blogs",newdiv);
      break;
    case 'addblog':
      showcontent("addBlog",newdiv);
      break;
    case 'adduser':
      showcontent("addUser",newdiv);
      break;
    case 'uqueries':
      showcontent("database.queries",newdiv);
      break;
    case 'rqueries':
      showcontent("database.queries",newdiv);
      break;
    case 'log':
      showcontent("database.log",newdiv);
      break;
  }
}

export async function showcontent (data,targetdiv) {
  if (targetdiv.id == 'users'){
    async function ftchusrs(url) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({token: getdata('admin')}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
        if (data.success == true) {
           showusers(data.message);
        }else{
          alertMessage(data.message)
        }
      } catch (error) {
        alertMessage(error);
      }
    }
    ftchusrs("https://myblosite.onrender.com/api/viewusers");
    function showusers(data) {
      var atr = document.createElement('tr');
      targetdiv.childNodes[3].childNodes[1].innerHTML = null;
      targetdiv.childNodes[3].childNodes[1].appendChild(atr);
      atr.innerHTML = ` <td class="p-10p bsbb bb-1-s-g">
                  <span class="fs-15p verdana p-10p">#</span>
                </td>
                <td class="p-10p bsbb bb-1-s-g">
                  <span class="fs-15p verdana p-10p">First&nbsp;name</span>
                </td>
                <td class="p-10p bsbb bb-1-s-g">
                  <span class="fs-15p verdana p-10p">Last&nbsp;name</span>
                </td>
                <td class="p-10p bsbb bb-1-s-g">
                  <span class="fs-15p verdana p-10p">Email</span>
                </td>
                <td class="p-10p bsbb bb-1-s-g">
                  <span class="fs-15p verdana p-10p">action</span>
                </td>
                `;
      i = 1;
      data.forEach(users=>{
        auser = document.createElement('tr');
        targetdiv.childNodes[3].childNodes[1].appendChild(auser);
        auser.innerHTML = `
                <td class="p-10p bsbb">
                  <span class="fs-14p verdana">${i}</span>
                </td>
                <td class="p-10p bsbb">
                  <span class="fs-14p verdana">${users.firstname}</span>
                </td>
                <td class="p-10p bsbb">
                  <span class="fs-14p verdana">${users.lastname}</span>
                </td>
                <td class="p-10p bsbb">
                  <span class="fs-14p verdana">${users.email}</span>
                </td>
                <td class="p-10p">
                  <span class="fs-14p verdana red center hover-2 us-none delete" id='${users._id}'>delete</span>
                </td>`;
                i+=1;
      })
      const deletee = Array.from(document.querySelectorAll('span.delete'));
      if (deletee.length > 0) {
        deletee.forEach(del=>{
          del.addEventListener('click',e=>{
            e.preventDefault();
            async function ftchusrs(url) {
              try {
                const response = await fetch(url,{
                  mode: 'cors',
                  method: "POST",
                  body: JSON.stringify({id: del.id,token: getdata('admin')}),
                  headers: {
                    "content-type": "application/json",
                    'accept': '*/*'

                }
                });
                const data = await response.json();
                if (data.success == true) {
                  alertMessage(data.message)
                  showcontent("database.users",targetdiv);
                }else{
                  alertMessage(data.message)
                }
              } catch (error) {
                alertMessage(error);
              }
            }
            ftchusrs("https://myblosite.onrender.com/api/deleteuser"); 
          })
        })
      }
    }

  }else if (targetdiv.id == 'usersblogs') {
    let data = await ftchblgswthcndtn("https://myblosite.onrender.com/api/ftchblgswthcndtn",'_USER_BLOG_');
    var atr = document.createElement('tr');
    targetdiv.childNodes[3].childNodes[1].innerHTML = null;
    targetdiv.childNodes[3].childNodes[1].appendChild(atr);
    atr.innerHTML = ` <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">#</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Owner&nbsp;name</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Title</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">description</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g center">
                <span class="fs-15p verdana p-10p center">action</span>
              </td>
              `;
    i = 1;
    data.forEach(blogs=>{
      if (blogs.blog_type == '_USER_BLOG_') {
      auser = document.createElement('tr');
      targetdiv.childNodes[3].childNodes[1].appendChild(auser);
      auser.innerHTML = `
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${i}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${blogs.ownr_name}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${blogs.title}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${ellipsis(blogs.description,20)}</span>
              </td>
              <td class="p-10p flex w-150p jc-sb right">
                <span class="fs-14p verdana green center hover-2 us-none viewlink" id='${blogs._id}'>view</span>
                <span class="fs-14p verdana orange center hover-2 us-none editlink" id='${blogs._id}'>edit</span>
                <span class="fs-14p verdana red center hover-2 us-none deletelink" id='${blogs._id}'>delete</span>
              </td>`;
              i+=1;
      }
    })
    var editlink = Array.from(document.querySelectorAll('span.editlink'));
    editlink.forEach(s=>{
        s.addEventListener('click',async(e)=>{
          e.preventDefault();
          i = await editBlog(s.id, getdata('admin'));
          // if (i.success) {
          //   alertMessage(i.message);
          //   showcontent('data',targetdiv)
          // }
        })
      })
    const deletee = Array.from(document.querySelectorAll('span.delete'));
    var viewlink = Array.from(document.querySelectorAll('span.viewlink'));
    var deletelink = Array.from(document.querySelectorAll('span.deletelink'));
      deletelink.forEach(s=>{
        s.addEventListener('click',async(e)=>{
          e.preventDefault();
          i = await deleteBlog(s.id, getdata('admin'));
          if (i.success) {
            alertMessage(i.message);
            showcontent('data',targetdiv)
          }
        })
      })
      viewlink.forEach(s=>{
        s.addEventListener('click',e=>{
          e.preventDefault();
          showBlog(s.id,'admin');
        })
      })
    if (deletee.length > 0) {
      deletee.forEach(del=>{
        del.addEventListener('click',e=>{
          e.preventDefault();
          database = JSON.parse(localStorage.getItem('database'));
          database.blogs.splice(parseInt(del.id),1);
          localStorage.setItem('database',JSON.stringify(database));
          showcontent(database.blogs,targetdiv);
        })
      })
    }
  }else if (targetdiv.id == 'myblogs') {
    let data = await ftchblgswthcndtn("https://myblosite.onrender.com/api/ftchblgswthcndtn",'_ADMIN_BLOG_');
    var atr = document.createElement('tr');
    targetdiv.childNodes[3].childNodes[1].innerHTML = null;
    targetdiv.childNodes[3].childNodes[1].appendChild(atr);
    atr.innerHTML = ` <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">#</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Owner&nbsp;name</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Title</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">description</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">action</span>
              </td>
              `;
    i = 1;
    data.forEach(blogs=>{
      if (blogs.blog_type == '_ADMIN_BLOG_') {
      auser = document.createElement('tr');
      targetdiv.childNodes[3].childNodes[1].appendChild(auser);
      auser.innerHTML = `
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${i}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${blogs.ownr_name}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${blogs.title}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${ellipsis(blogs.description,20)}</span>
              </td>
              <td class="p-10p flex jc-sb">
                <span class="fs-14p verdana green center-2 hover-2 us-none viewlink" id='${blogs._id}'>view</span>
                <span class="fs-14p verdana orange center-2 hover-2 us-none editlink" id='${blogs._id}'>edit</span>
                <span class="fs-14p verdana red center-2 hover-2 us-none deletelink" id='${blogs._id}'>delete</span>
              </td>`;
              i+=1;
      }
    })

    const deletee = Array.from(document.querySelectorAll('span.delete'));
    var deletelink = Array.from(document.querySelectorAll('span.deletelink'));
    var editlink = Array.from(document.querySelectorAll('span.editlink'));
    editlink.forEach(s=>{
        s.addEventListener('click',async(e)=>{
          e.preventDefault();
          i = await editBlog(s.id, getdata('admin'));
          // if (i.success) {
          //   alertMessage(i.message);
          //   showcontent('data',targetdiv)
          // }
        })
      })
      deletelink.forEach(s=>{
        s.addEventListener('click',async (e)=>{
          e.preventDefault();
           i = await deleteBlog(s.id, getdata('admin'))
           if (i.success) {
            alertMessage(i.message);
            showcontent('data',targetdiv)
           }
        })
      })
    var viewlink = Array.from(document.querySelectorAll('span.viewlink'));
      viewlink.forEach(s=>{
        s.addEventListener('click',e=>{
          e.preventDefault();
          showBlog(s.id,'admin');
        })
      })
    if (deletee.length > 0) {
      deletee.forEach(del=>{
        del.addEventListener('click',e=>{
          e.preventDefault();
          database = JSON.parse(localStorage.getItem('database'));
          database.blogs.splice(parseInt(del.id),1);
          localStorage.setItem('database',JSON.stringify(database));
          showcontent(database.blogs,targetdiv);
        })
      })
    }
  }else if (targetdiv.id == 'uqueries') {
    var atr = document.createElement('tr');
    targetdiv.childNodes[3].childNodes[1].innerHTML = null;
    targetdiv.childNodes[3].childNodes[1].appendChild(atr);
    atr.innerHTML = ` <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">#</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Contactor&nbsp;name</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Email</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">subject</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">action</span>
              </td>
              `;
    i = 1;
    data.forEach(queries=>{
      if (queries.status == 'new') {
      auser = document.createElement('tr');
      targetdiv.childNodes[3].childNodes[1].appendChild(auser);
      auser.innerHTML = `
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${i}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${queries.firstname}&nbsp;${queries.lastname}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${queries.email}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${queries.subject}</span>
              </td>
              <td class="p-10p">
              <span class="fs-14p verdana green  hover-2 us-none view" id='${data.indexOf(queries)}'>view</span>
                <span class="fs-14p verdana orange right hover-2 us-none seen" id='${data.indexOf(queries)}'>mark&nbsp;as&nbsp;seen</span>
              </td>`;
              i+=1;
      }
    })
    const deletee = Array.from(document.querySelectorAll('span.seen'));
    if (deletee.length > 0) {
      deletee.forEach(del=>{
        del.addEventListener('click',e=>{
          e.preventDefault();
          database = JSON.parse(localStorage.getItem('database'));
          database.queries[parseInt(del.id)].status = "seen";
          localStorage.setItem('database',JSON.stringify(database));
          showcontent(database.queries,targetdiv);
        })
      })
    }
  }else if (targetdiv.id == 'rqueries') {
    var atr = document.createElement('tr');
    targetdiv.childNodes[3].childNodes[1].innerHTML = null;
    targetdiv.childNodes[3].childNodes[1].appendChild(atr);
    atr.innerHTML = ` <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">#</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Contactor&nbsp;name</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">Email</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">subject</span>
              </td>
              <td class="p-10p bsbb bb-1-s-g">
                <span class="fs-15p verdana p-10p">action</span>
              </td>
              `;
    i = 1;
    data.forEach(queries=>{
      if (queries.status == 'seen') {
      auser = document.createElement('tr');
      targetdiv.childNodes[3].childNodes[1].appendChild(auser);
      auser.innerHTML = `
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${i}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${queries.firstname}&nbsp;${queries.lastname}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${queries.email}</span>
              </td>
              <td class="p-10p bsbb">
                <span class="fs-14p verdana">${queries.subject}</span>
              </td>
              <td class="p-10p">
              <span class="fs-14p verdana green center hover-2 us-none view" id='${data.indexOf(queries)}'>view</span>
                <span class="fs-14p verdana red center hover-2 us-none seen" id='${data.indexOf(queries)}'>delete</span>
              </td>`;
              i+=1;
      }
    })
    const deletee = Array.from(document.querySelectorAll('span.seen'));
    if (deletee.length > 0) {
      deletee.forEach(del=>{
        del.addEventListener('click',e=>{
          e.preventDefault();
          database = JSON.parse(localStorage.getItem('database'));
          database.queries.splice(parseInt(del.id),1);
          localStorage.setItem('database',JSON.stringify(database));
          showcontent(database.queries,targetdiv);
        })
      })
    }
  }else if (targetdiv.id == 'home'){
    var cards = Array.from(document.querySelectorAll('font.cardsc'));
    async function ftchnbrs(url) {
      try {
        const response = await fetch("https://myblosite.onrender.com/api/ftchnbrs",{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({token: getdata('admin')}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
        if (data.success == true) {
           addnbrs(data.message);
        }else{
          alertMessage(data.message)
        }
      } catch (error) {
        alertMessage(error);
      }
    }
    ftchnbrs("https://myblosite.onrender.com/api/ftchnbrs");
    function addnbrs(numbers) {
      cards.forEach(nbrs=>{
        if (nbrs.id == 'users') {
          numbers.forEach(ttl=>{
            if (ttl.id == nbrs.id) {
              nbrs.innerText = ttl.total;        
            }
          })
        }else if (nbrs.id == 'nqueries') {
          numbers.forEach(ttl=>{
            if (ttl.id == nbrs.id) {
              nbrs.innerText = ttl.total;        
            }
          })
        }else if (nbrs.id == 'blogs') {
          numbers.forEach(ttl=>{
            if (ttl.id == nbrs.id) {
              nbrs.innerText = ttl.total;        
            }
          })
        }else if (nbrs.id == 'queries') {
          numbers.forEach(ttl=>{
            if (ttl.id == nbrs.id) {
              nbrs.innerText = ttl.total;        
            }
          })        
        }
      })
    }
  }
}
export async function ftchblgswthcndtn(url,condition) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({token: getdata('admin'), condition: condition}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
        if (data.success == true) {
         return data.message;

        }else{
          alertMessage(data.message)
        }
      } catch (error) {
        alertMessage(error);
      }
    }

export async function deleteBlog(blogid,userinfo) {
      try {
        const response = await fetch("https://myblosite.onrender.com/api/deleteblog",{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({blogid : blogid,token: userinfo}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
          return data
      } catch (error) {
        alertMessage(error)
      }
  }
export function ellipsis(text, limit) {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}
export async function showBlog(blogid,from) {
  auser = getdata('user')
  let data = await ftch("https://myblosite.onrender.com/api/getblog",blogid,auser);
  showb(data);
  var divs = Array.from(document.querySelectorAll('div.content'));
  divs.forEach(div=>{
    div.classList.add("blur");
  })
  function showb(blog){
    var leFull = document.createElement('div');
    let body = document.getElementById('body');
    body.appendChild(leFull);
    leFull.className = "p-f w-100 h-100 bc-tr-black t-0 p-40p bsbb zi-10000 shade";
    leFull.innerHTML = `
    <div class="w-100 h-90 p-10p bsbb bc-white cntr zi-10000 card-3 p-r">
      <div class="head w-100 h-40p p-5p bsbb bb-1-s-dg">
        <span class="fs-18p black capitalize igrid center h-100 verdana">${blog.message.title}</span>
        <span class="right igrid  h-100 close hover-2">
          <svg version="1.1" class="w-30p h-30p" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g></svg>
        </span>
      </div>
      <div class="w-100 h-90 p-5p grid mt-10p">
        <div class="text w-100 h-a ovh bsbb p-r ">
          <span class="left w-100 h-100 p-r">
            <div class="w-100 h-100 p-10p bsbb p-r">
              <div class="iblock w-55 h-100">
                <img src="${blog.message.image}" class="w-100 h-100 cover">
              </div>
              <div class="w-45 h-100 p-5p iblock p-a t-0 ovh">
                <div class="w-a h-30p center-2">
                  <div class="p-10p iblock linkswitcher hover-2 bb-1-s-theme ">
                    <div class="fs-14p theme verdana us-none">comments</div>
                  </div>
                  <div class="p-10p iblock linkswitcher hover-2 ">
                    <div class="fs-14p   verdana us-none">description</div>
                  </div>
                </div>
                <div class="descsec w-100 h-90 tr-0-3 p-10p p-r">
                  <div class="w-100 h-100 p-5p iblock p-a tr-0-3 contentdivs ">
                    <div class="h-80 w-100 ovys ovxh scroll-2 ">
                    <div class="left fs-15p black commentssection w-100 h-a left">
                      
                      
                    </div>
                    </div>
                    <div class="commentingsection w-100 h-60p p-10p p-a b-0 block">
                      <div class="formhol w-100 h-100 p-5p bc-gray br-5p">
                        <form method="post" action="" class="commentform">
                          <div class="inputhol w-100 h-100 p-r">
                            <input type="text" name="comment" class="w-100 no-outline p-10p bsbb b-none transparent">
                            <div class="p-a fs-15p theme subbutton hover-2 r-0 t-0 p-5p bc-gray br-5p w-30p h-30p bsbb">
                              <button class="p-0 m-0 transparent b-none" type="submit">
                                <svg class="w-20p h-20p" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="miter">
                                  <polygon points="3 3 20 12 3 21 6 12 3 3"></polygon>
                                  <line x1="10" y1="12" x2="6" y2="12"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div class="w-100 h-100 p-5p iblock p-a  tr-0-3 contentdivs ml-100">
                    <div class="left fs-15p black">
                      ${blog.message.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>`;
    body.classList.add('ovh');
    var close = document.querySelector("span.close");
    close.addEventListener("click",e=>{
      e.preventDefault();
      if (from == 'user') {
        chkBlgCntnt()
      }
      closeTab(body,leFull,divs);
    })

    let linkswitcher = Array.from(document.querySelectorAll('div.linkswitcher'));
    let contentdivs = Array.from(document.querySelectorAll('div.contentdivs'));
    linkswitcher.forEach(ls=>{
      ls.addEventListener('click',e=>{
        e.preventDefault();
        if (linkswitcher.indexOf(ls) == 0) {
          ls.classList.add('bb-1-s-theme');
          ls.childNodes[1].classList.add('theme');
          linkswitcher[1].classList.remove('bb-1-s-theme');
          linkswitcher[1].childNodes[1].classList.remove('theme');
          contentdivs[0].classList.remove('ml--100')
          contentdivs[1].classList.add('ml-100')

        }else{
          ls.classList.add('bb-1-s-theme');
          ls.childNodes[1].classList.add('theme');
          linkswitcher[0].classList.remove('bb-1-s-theme');
          linkswitcher[0].childNodes[1].classList.remove('theme');
          contentdivs[0].classList.add('ml--100')
          contentdivs[1].classList.remove('ml-100')
        }
      })
    })
    socket.on('newcomment', function(message){
      message = JSON.parse(message)
      upc(message.content,message.name,commentssection,message.uid)
    })
    let commentssection = document.querySelector('div.commentssection');
    let commentform = document.querySelector('form.commentform');
    let input = commentform.querySelector('input');
    input.focus();
    input.addEventListener('blur',e=>{
      e.preventDefault();
      input.focus();
    })
    checkcomments(commentssection,blog.message.comments);
    let subbutton = commentform.querySelector('div.subbutton');
    input.addEventListener('keyup',e=>{
      e.preventDefault();
      if (input.value.length > 0) {
        subbutton.classList.add('bc-dgray');
      }else{
        subbutton.classList.remove('bc-dgray');
      }
    })
    
    commentform.addEventListener('submit',e=>{
      e.preventDefault();
      input = commentform.querySelector('input');
      if (input.value.trim().length > 0) {
        let user = getdata('user');
        if (user == null) {
          user = getdata('admin');
          if (user == null) {
            input.blur();
            alertMessage('please you must first login to add a comment');
          }else{
          addComment(blog.message._id,input.value.trim(),commentssection,commentform,user);
          }
        }else{
          addComment(blog.message._id,input.value.trim(),commentssection,commentform,user);
        }
      }
    })
  }
}
export function addComment(blogid,value,commentssection,commentform,userinfo){
  addcmnt("https://myblosite.onrender.com/api/addcomment",blogid,value,userinfo);
  async function addcmnt(url,blogid,value,userinfo) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({id : blogid,data: {content: value},token: userinfo}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
          if (data.success) {
            auser = getdata('user');
            if (auser == null) {
              auser = getdata('admin')
              let name = "admin"
              let uid = "admin"
              let xx = {name: name, content: value,uid: uid};
              socket.emit('newcommentdata',JSON.stringify(xx))
            }else{
                let name = JSON.parse(localStorage.getItem('user')).name
                let uid = JSON.parse(localStorage.getItem('user')).uid
                let xx = {name: name, content: value,uid: uid};
                socket.emit('newcommentdata',JSON.stringify(xx))

            }
      
            
          }else{
            alertMessage(data.message)
          }
      } catch (error) {
        alertMessage(error)
      }
  }
  
  
  commentform.reset()
}
function upc(content,name,commentssection,uid) {
    auser = localStorage.getItem('user');
    if (auser == null) {
      auser = null
    }else{
      auser = JSON.parse(auser).uid
    }
    if (uid == auser) {
      let div = document.createElement('div');
      div.className = "w-100 h-a p-5p block"
      div.innerHTML = `
                        <div class="comment p-5p br-5p bc-theme mw-200p right ovh">
                          <div class="commentownername p-3p white left w-100 block">
                            <font class="left fs-12p capitalize">
                              me
                            </font>
                          </div>
                          <div class="commentcontent p-3p block w-100 white left">
                            ${content}
                          </div>
                        </div>`
      commentssection.appendChild(div)
      commentssection.parentNode.classList.add('smooth');
      commentssection.parentNode.scrollTo(0,commentssection.offsetHeight)
    }else {
      let div = document.createElement('div');
      div.className = "w-100 h-a p-5p block"
      div.innerHTML = `
                        <div class="comment p-5p br-5p bc-gray mw-200p left ovh">
                          <div class="commentownername p-3p dgray left w-100 block">
                            <font class="left fs-12p capitalize">
                              ${name}
                            </font>
                          </div>
                          <div class="commentcontent p-3p block w-100 black left">
                            ${content}
                          </div>
                        </div>`
      commentssection.appendChild(div)
      commentssection.parentNode.classList.add('smooth');
      commentssection.parentNode.scrollTo(0,commentssection.offsetHeight)
    }
  }
export function checkcomments(div,comments) {
  div.innerHTML = null;
  comments.forEach(comment=>{
      if (comment.ownername == "me") {
        div.innerHTML+=`<div class="w-100 h-a p-5p block">
                      <div class="comment p-5p br-5p bc-theme mw-200p right ovh">
                        <div class="commentownername p-3p white left w-100 block">
                          <font class="left fs-12p capitalize">
                            me
                          </font>
                        </div>
                        <div class="commentcontent p-3p block w-100 white left">
                          ${comment.content}
                        </div>
                      </div>
                    </div>`
      }else{
        div.innerHTML+=`<div class="w-100 h-a p-5p block">
                      <div class="comment p-5p br-5p bc-gray mw-200p left ovh">
                        <div class="commentownername dgray left w-100 block p-3p dgray">
                          <font class="left fs-12p capitalize">
                            ${comment.ownername}
                          </font>
                        </div>
                        <div class="commentcontent p-3p left black w-100">
                           ${comment.content}
                        </div>
                      </div>
                    </div>`
      }
    div.scrollTop += 900
  })
  
    div.parentNode.scrollTo(0,div.offsetHeight);
}
export function getdata(key){
  let data = localStorage.getItem(key);
  if (data != null) {
    let userinfo =  JSON.parse(data).token
      return userinfo

  }else{
    return null
  }
}
export async function editBlog(blogid) {
   var leFull = document.createElement('div');
  let body = document.getElementById('body');
  body.appendChild(leFull);
  var divs = Array.from(document.querySelectorAll('div.content'));
  divs.forEach(div=>{
    div.classList.add("blur");
  })
  auser = getdata('admin')
  let data = await ftch("https://myblosite.onrender.com/api/getblog",blogid,auser);
  leFull.className = "p-f w-100 h-100 bc-tr-black t-0 p-40p bsbb zi-10000 shade";
  leFull.innerHTML = `<div class="w-60 h-90 p-20p bsbb bc-white cntr zi-10000 card-3 p-r">
                        <div class="head w-100 h-50p p-5p bsbb bb-1-s-dg">
                          <span class="fs-18p black capitalize igrid center h-100 verdana">edit a blog</span>
                          <span class="right igrid  h-100 close hover-2">
                            <svg version="1.1" class="w-30p h-30p" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g></svg>
                          </span>
                        </div>
                        <div class="body w-100 h-90 p-5p grid mt-10p p-r ovh">
                          <div class="text w-60 h-a bsbb bsbb p-r iblock">
                              <span class="right w-100 h-100  p-r">
                                <div class="w-100 h-100 p-10p bsbb">
                                  <form method="post" name="blog_form" class="p-10p bsbb" id="blog-form">
                                    <div class="w-100 h-60p mt-10p mb-10p p-10p bsbb">
                                      <div class="p-r w-100 igrid mr-10p left parent p-r">
                                        <input type="text" name="title" placeholder="Title" class="p-10p no-outline bsbb b-1-s-dgray bc-white" value="${data.message.title}">
                                        <span class="p-a r-0 mt-10p mr-5p">
                                          <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="#FF0000"/>
                                            <path d="M11.0717 5.27273L10.8757 11.3281H9.12429L8.92827 5.27273H11.0717ZM9.99787 14.1236C9.69389 14.1236 9.43253 14.0156 9.21378 13.7997C8.99787 13.5838 8.88991 13.3224 8.88991 13.0156C8.88991 12.7145 8.99787 12.4574 9.21378 12.2443C9.43253 12.0284 9.69389 11.9205 9.99787 11.9205C10.2905 11.9205 10.5476 12.0284 10.7692 12.2443C10.9936 12.4574 11.1058 12.7145 11.1058 13.0156C11.1058 13.2202 11.0533 13.4062 10.9482 13.5739C10.8459 13.7415 10.7109 13.875 10.5433 13.9744C10.3786 14.0739 10.1967 14.1236 9.99787 14.1236Z" fill="white"/>
                                          </svg>
                                          <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="#68D753"/>
                                            <line x1="6.38765" y1="8.96481" x2="9.54712" y2="12.8401" stroke="white"/>
                                            <line x1="8.80605" y1="12.7273" x2="14.8872" y2="6.64614" stroke="white"/>
                                          </svg>
                                        </span>
                                        <small class="red verdana hide ml-5p">error mssg</small>
                                      </div>
                                    </div>
                                    <div class="w-100 h-100p mt-10p mb-10p p-10p bsbb">
                                      <div class="p-r w-40 igrid mr-10p left parent ovh h-100">
                                        <div class="p-10p no-outline bsbb b-1-s-dgray bc-white w-100 mt-10p h-40p hover-2 dgray capitalize fs-14p">change image</div>
                                        <input type="file" name="image" placeholder="Thumbnail" class="p-a mt-10p op-0 hover-2 h-40p w-100 " id="imagenew">
                                        <span class="p-a r-0 mt-20p mr-5p w-20p h-20p zi-10000">
                                          <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="#FF0000"/>
                                            <path d="M11.0717 5.27273L10.8757 11.3281H9.12429L8.92827 5.27273H11.0717ZM9.99787 14.1236C9.69389 14.1236 9.43253 14.0156 9.21378 13.7997C8.99787 13.5838 8.88991 13.3224 8.88991 13.0156C8.88991 12.7145 8.99787 12.4574 9.21378 12.2443C9.43253 12.0284 9.69389 11.9205 9.99787 11.9205C10.2905 11.9205 10.5476 12.0284 10.7692 12.2443C10.9936 12.4574 11.1058 12.7145 11.1058 13.0156C11.1058 13.2202 11.0533 13.4062 10.9482 13.5739C10.8459 13.7415 10.7109 13.875 10.5433 13.9744C10.3786 14.0739 10.1967 14.1236 9.99787 14.1236Z" fill="white"/>
                                          </svg>
                                          <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="#68D753"/>
                                            <line x1="6.38765" y1="8.96481" x2="9.54712" y2="12.8401" stroke="white"/>
                                            <line x1="8.80605" y1="12.7273" x2="14.8872" y2="6.64614" stroke="white"/>
                                          </svg>
                                        </span>
                                        <small class="red verdana hide ml-5p">error mssg</small>
                                      </div>
                                      <div class="p-r w-40 igrid  right h-100 parent">
                                        <div type="text" name="subject" class="no-outline bsbb b-1-s-dgray bc-white w-100 h-100p mt--20p previewpaneledit" id="previewpaneledit"><span class="w-100 h-100 p-10p center verdana dgray fs-13p capitalize">preview</span></div>
                                      </div>
                                    </div>
                                    <div class="w-100 h-60p mt-10p mb-10p p-10p bsbb">
                                      <div class="p-r w-100 igrid mr-10p left parent">
                                        <textarea rows="4" cols="50" placeholder="description" name="description" class="p-10p no-outline bsbb b-1-s-dgray bc-white">${data.message.description}</textarea>
                                        <span class="p-a r-0 mt-10p mr-5p">
                                          <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="#FF0000"/>
                                            <path d="M11.0717 5.27273L10.8757 11.3281H9.12429L8.92827 5.27273H11.0717ZM9.99787 14.1236C9.69389 14.1236 9.43253 14.0156 9.21378 13.7997C8.99787 13.5838 8.88991 13.3224 8.88991 13.0156C8.88991 12.7145 8.99787 12.4574 9.21378 12.2443C9.43253 12.0284 9.69389 11.9205 9.99787 11.9205C10.2905 11.9205 10.5476 12.0284 10.7692 12.2443C10.9936 12.4574 11.1058 12.7145 11.1058 13.0156C11.1058 13.2202 11.0533 13.4062 10.9482 13.5739C10.8459 13.7415 10.7109 13.875 10.5433 13.9744C10.3786 14.0739 10.1967 14.1236 9.99787 14.1236Z" fill="white"/>
                                          </svg>
                                          <svg width="15" height="15" viewBox="0 0 20 20" class="hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="#68D753"/>
                                            <line x1="6.38765" y1="8.96481" x2="9.54712" y2="12.8401" stroke="white"/>
                                            <line x1="8.80605" y1="12.7273" x2="14.8872" y2="6.64614" stroke="white"/>
                                          </svg>
                                        </span>
                                        <small class="red verdana hide ml-5p">error mssg</small>
                                      </div>
                                    </div>
                                    <div class="w-a  h-60p mt-10p p-r right mb-10p p-10p bsbb">
                                      <div class="w-100 igrid">
                                        <span class="center iblock">
                                          <button class="bc-theme p-10p b-none w-150p">
                                            <span class="verdana white fs-15p capitalize">edit</span>
                                          </button>
                                        </span>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </span>
                          </div>
                           <div class="text w-40 h-a bsbb bsbb bc-white h-100 iblock p-a t-0 r-0">
                            <div class="head w-100 h-50p p-5p bsbb bb-1-s-dg">
                              <span class="fs-18p black capitalize igrid center h-100 verdana">
                                comments
                              </span>
                            </div>
                            <div class="h-80 w-100 ovys ovxh scroll-2 ">
                              <div class="left fs-15p black commentssection w-100 h-a left">
                                  
                                  
                              </div>
                            </div>
                           </div>
                        </div>
                      </div>`;
  let imagenew = document.getElementById('imagenew')
  imagenew.addEventListener('change',e=>{
    e.preventDefault()
    if (imagenew.value == '') {
      setErrorFor(inp,"choose an image");
      return 0;
    }else if (imagenew.value != '') {
      dec = checkFileType(imagenew);
      console.log(dec)
      if (dec[0] == 'image') {
        console.log(1)
        setSuccessFor(imagenew);
        i = document.getElementById('previewpaneledit')
        console.log(i)
        showPreview(imagenew,i,"new",null);
      }else{
        setErrorFor(imagenew,'only images are allowed');
        document.getElementById('previewpaneledit').innerHTML = `<span class="w-100 h-100 p-10p center verdana dgray fs-13p capitalize">preview</span>`;
        return 0;
      }

    }
  })
  showPreview(null,document.querySelector('div.previewpaneledit'),null,data.message.image)
  let div = document.querySelector('div.commentssection')
  data.message.comments.forEach(comment=>{
        div.innerHTML+=`<div class="w-100 h-a p-5p block p-r">
                      <div class="iblock comment p-5p br-5p mw-200p left ovh">
                        <div class="commentownername p-3p black left w-100 block">
                          <font class="left fs-12p capitalize">
                          <font class="dgray">owner name</font>: ${comment.ownername}
                          </font>
                        </div>
                        <div class="commentcontent p-3p block w-100 dgray left">
                          ${comment.content}
                        </div>
                      </div>
                      <div class="iblock p-5p w-40p red us-none ovh deletecomment p-a t-0 r-0 mt-15p hover-2" id="${comment.id}">delete</div>
                    </div>`
    div.scrollTop += 900
  })
  
  div.parentNode.scrollTo(0,div.offsetHeight);
  body.classList.add('ovh');
  let deletecomment = Array.from(document.querySelectorAll('div.deletecomment'))
  deletecomment.forEach(async (dlc)=>{
    dlc.addEventListener('click',async e=>{
      e.preventDefault()
      dlc.parentNode.classList.add('op-0-3')
      i = await delco('https://myblosite.onrender.com/api/deletecomment',data.message._id,dlc.id,getdata('admin'))
      if (i.success) {
        dlc.parentNode.parentNode.removeChild(dlc.parentNode)
      }
    })

  })
  var blogForm = document.getElementById('blog-form');
  input = Array.from(document.getElementsByTagName('input'));
  textarea = blogForm.querySelector("textarea");
  input.push(textarea);
  input.forEach(inp=>{
    inp.addEventListener('focus',e=>{
      inp.parentNode.classList.add('focus');
    })
  })
  input.forEach(inp=>{
    inp.addEventListener('blur',e=>{
      inp.parentNode.classList.remove('focus');
      if (inp.type != 'file' && inp.value == "") {
        setErrorFor(inp,"please fill out this field");
      }else if (inp.type != 'file' && inp.value != '') {
        setSuccessFor(inp);
      }
    })
  })
  input.forEach(inp=>{
    inp.addEventListener('change',e=>{
      if (inp.type == 'file' && inp.value == '') {
        setErrorFor(inp,"choose an image");
        return 0;
      }else if (inp.type == 'file' && inp.value != '') {
        dec = checkFileType(inp)[0];
        if (dec == 'image') {
          setSuccessFor(inp);
          showPreview(inp,document.querySelector('div.previewpanel'),"new",null);
          return 1;
        }else{
          setErrorFor(inp,'only images are allowed');
          document.querySelector('div.previewpanel').innerHTML = `<span class="w-100 h-100 p-10p center verdana dgray fs-13p capitalize">preview</span>`;
          return 0;
        }

      }
    })
  })
  var close = document.querySelector("span.close");
  blogForm.addEventListener("submit",e=>{
    e.preventDefault();
    validateForm(blogForm,input);
  })
  close.addEventListener("click",e=>{
    e.preventDefault();
    closeTab(body,leFull,divs);
  })
}
export async function ftch(url,blogid,userinfo) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({blogid : blogid,token: userinfo}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
          return data
      } catch (error) {
        return error
      }
  }
  export async function delco(url,blogid,commentid,userinfo) {
      try {
        const response = await fetch(url,{
          mode: 'cors',
          method: "POST",
          body: JSON.stringify({blogid : blogid,commentid: commentid,token: userinfo}),
          headers: {
            "content-type": "application/json",
            'accept': '*/*'

        }
        });
        const data = await response.json();
          return data
      } catch (error) {
        return error
      }
  }
// vidsiren 

