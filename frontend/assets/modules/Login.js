const validator = require('validator')
export default class Login{
    constructor(formClass){
        this.form = document.querySelector(formClass);
    }

    init(){
        this.event()
    }

    event(){
        if (!this.form) return;
        this.form.addEventListener('submit', e =>{
            
            e.preventDefault();
        if(this.validate(e)){
            return this.form.submit()
        }

        })
        return

    }
    validate(e){
        for(let error of document.querySelectorAll('.errormsg')){
            error.remove()
        }
        const email = this.form.querySelector('input[name="email"]');
        const password = this.form.querySelector('input[name="password"]');

        let valid = true
        if(!password.value){
            this.addMsg(password,'Digite a senha')
            valid = false;
        }
        if(!validator.isEmail(email.value)){

            valid = false;
            this.addMsg(email,'Email inválido!')
        } 
        if(password.value.length < 3 || password.value.length > 40){
            this.addMsg(password,'Senha deve ter entre 3 e 40 caracteres.')
            valid = false;
        } 

        return valid
    }
    addMsg(el, msg){
        const p = document.createElement('p');
        p.innerText = msg;
        p.classList.add('errormsg')

        el.insertAdjacentElement('afterend', p);
        
    }
}