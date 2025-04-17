var activepg,i,dec
import {chagecontent} from '../../js/functions.js'
import {swtchcntnt} from '../../js/functions.js'
import {showcontent} from '../../js/functions.js'
import {ellipsis} from '../../js/functions.js'
import {validateForm} from '../../js/functions.js'
import {vdtemail} from '../../js/functions.js'
import {checkFileType} from '../../js/functions.js'
import {showPreview} from '../../js/functions.js'
import {setSuccessFor} from '../../js/functions.js'
import {setErrorFor} from '../../js/functions.js'







var signup_form = document.getElementById('signup-form');
var titles = Array.from(document.querySelectorAll('li.titles'));
var navbar = document.getElementById('navbar');
var cont = document.getElementById('cont');
var sCard = document.createElement("div");
let home = document.getElementById('home');
var blogForm = document.getElementById('blog-form');
var linkSwitcher = Array.from(document.querySelectorAll('li.linkSwitcher'));
var pagesection = Array.from(document.querySelectorAll('div.pagecontentsection'));
var input = Array.from(document.getElementsByTagName('input'));
swtchcntnt(home);
linkSwitcher.forEach(e=>{
	e.addEventListener('click',d=>{
		d.preventDefault();
		pagesection.forEach(pgsec=>{
			if (pgsec.id == e.id) {
				activepg = document.querySelector('div.active');
				if (activepg !=pgsec) {
					chagecontent(pgsec,activepg);
				}
			}
		})

	})
})
titles.forEach(ttl=>{
	ttl.addEventListener('click',e=>{
		e.preventDefault();
		var c = ttl.childNodes;
		if (c.length != 3) {
			if (c[3].classList.contains('hidden')) {
				c[3].classList.remove('hidden');
				ttl.classList.add('expand');

			}else{
				c[3].classList.add('hidden');
				ttl.classList.remove('expand');
			}
		}
	})
})
signup_form.addEventListener('submit',e=>{
  e.preventDefault();
  var ins = Array.from(signup_form.querySelectorAll('input'));
  validateForm(signup_form,ins); 
})
 
input.forEach(e=>{

	if (e.id == 'emailsignup') {
    e.addEventListener('keyup',f=>{
      vdtemail(e.value,e);
    })
  }
	e.addEventListener('focus',f=>{
		var parent = e.parentNode;
		var placeholder = parent.childNodes[5];
		if (parent.childNodes.length > 5) {
			placeholder.classList.remove('hidden');
		}
		parent.classList.add('focus');
	})
})
input.forEach(e=>{
	e.addEventListener('blur',f=>{
		var parent = e.parentNode;
		var placeholder = parent.childNodes[5];
		if(e.value == ''){
			if (parent.childNodes.length > 5) {
				placeholder.classList.add('hidden');
			}
			parent.classList.remove('focus');
		}
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
          showPreview(inp,document.querySelector('div.previewpanel'));
          return 1;
        }else{
          setErrorFor(inp,'only images are allowed');
          document.querySelector('div.previewpanel').innerHTML = `<span class="w-100 h-100 p-10p center verdana dgray fs-13p capitalize">preview</span>`;
          return 0;
        }

      }
    })
  })
let textarea = blogForm.childNodes[5].childNodes[1].childNodes[1]
input.push(textarea);
blogForm.addEventListener("submit",e=>{
    e.preventDefault();
    validateForm(blogForm,input);
  })
