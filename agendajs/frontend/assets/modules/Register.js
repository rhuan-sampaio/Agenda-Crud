const validator = require('validator') 
export default class Register{
    constructor(){
        this.form = document.querySelector('.form-register')
    }
    init(){
        this.event();
    }
    event(){
        if(!this.form) return;
        this.form.addEventListener('submit', e =>{
            e.preventDefault();
            const el = e.target
            const validate1 = this.validate(el)
            const validate2 = this.passwordValidator(el)
            if ( validate1 && validate2){
                return this.form.submit()
            }
        })
        return

    }
    validate(el){
     
        let valid = true
      
        const inputFields = el.querySelectorAll('input')
        for (let error of el.querySelectorAll('.errormsg')){
            error.remove()
        }

        for (let field of inputFields){
            let label = field.previousElementSibling;
            
            if (field.name === '_csrf') continue;
            if (!field.value){
                this.errorMsg(field,`O campo "${label.innerText}" é obrigatório.`);
                valid = false;
            }
            if(field.name === 'email'){
                if (!validator.isEmail(field.value)){
                    valid = false;
                    this.errorMsg(field,`E-mail inválido!`);
                }
            }

            if(field.name === 'name' && field.value.length < 3 || field.value.length > 50){
                valid = false;
                this.errorMsg(field,`O campo "Nome" deve ter entre 3 e 50 caracteres.`);
            }
        }

        return valid

    }
    errorMsg(field,msg){
        const p = document.createElement('p');
        p.innerText = msg;
        p.classList.add('errormsg');
        field.insertAdjacentElement('afterend',p)
    }
    passwordValidator(el){
        let valid = true;
        const password = el.querySelector('input[name="password"]');
        const rPassword = el.querySelector('input[name="rpassword"]');
        if(password.value.length < 3 || password.value.length > 40){
            this.errorMsg(password,'Campo "Senha" deve estar entre 3 e 40 caracteres.');
            valid = false;
        }
        if(password.value !== rPassword.value){
            this.errorMsg(password,'Campo "Senha" e "Repetir Senha" devem ser iguais.');
            valid = false;
        }
        return valid
        
    }
}