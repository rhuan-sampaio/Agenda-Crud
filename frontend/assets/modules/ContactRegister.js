const validator = require('validator')
export default class ContactRegister{
    constructor(){
        this.form = document.querySelector('.contact-register');
    }
    init(){
        this.events();
    }
    events(){
        if(!this.form) return
        this.form.addEventListener('submit', e=>{
            e.preventDefault();
            const el = e.target;
            const validateForm = this.validate(el);
            if(validateForm){
                return this.form.submit();
            }
        })
    }
    validate(el){
        let valid = true;
        const name = el.querySelector('input[name="name"]')
        const lastname = el.querySelector('input[name="lastname"]')
        const email = el.querySelector('input[name="email"]')
        const number = el.querySelector('input[name="number"]')
        
        el.querySelectorAll('.errormsg').forEach(error=> error.remove())

        if(!name.value){
            ContactRegister.errorMsg(name,`O campo "Nome" é obrigatório.`)
            valid = false;
        }

        if(!email.value && !number.value){
            ContactRegister.errorMsg(email,'Insira ao menos 1 contato do tipo "E-mail" ou "Telefone"')
            ContactRegister.errorMsg(number,'Insira ao menos 1 contato do tipo "E-mail" ou "Telefone"')
            valid = false;
        }
        if(!name.value.match(/^[a-zA-ZáàäãâÁÀÄÃÂéèëẽÈÉËẼÊíìÍÌÏĨÎóòöõôÓÒÕÔÖúùüũûÚÙÜŨÛñÑ ]+$/g)){
            ContactRegister.errorMsg(name,`O campo "Nome" deve conter apenas letras.`)
            valid = false;
        }
        if(!lastname.value.match(/^[a-zA-ZáàäãâÁÀÄÃÂéèëẽÈÉËẼÊíìÍÌÏĨÎóòöõôÓÒÕÔÖúùüũûÚÙÜŨÛñÑ ]+$/g)){
            ContactRegister.errorMsg(lastname,`O campo "Sobreome" deve conter apenas letras.`)
            valid = false;
        }
        if(email.value){
            if(!validator.isEmail(email.value)){
            ContactRegister.errorMsg(email,'Insira um email válido.')
            valid = false;
            }
        }
        if(number.value){
            if(!number.value.match(/^[0-9\(\)\+\- ]+$/g)){
                ContactRegister.errorMsg(number,'Insira números ou símbolos válidos')
                valid = false;
            }
        }
        
        
        
    
        return valid;
    }
    static errorMsg(field, msg){
        const p = document.createElement('p');
        p.classList.add('errormsg');
        p.innerText = msg;
        field.insertAdjacentElement('afterend',p)
    }
}