const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email: String,
    password: String,
    rpassword: String
});

const LoginModel = mongoose.model('Login',LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    validate(){
        this.cleanUp()

        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
        if(this.body.password.length < 3 ||this.body.password.length > 40) this.errors.push('Senha deve ter entre 3 e 40 caracteres.');
        if(this.body.name.length < 1) this.errors.push('Digite um nome válido.');
        if(!this.body.name.match(/^[a-zA-ZáàâãñíìüäÀÁÃÂÄÉÈÊÌÍÓÒÔÕÚÙÜÑ ]+$/g)) this.errors.push('Nome deve conter somente letras');
    }
    async enter(){
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email:this.body.email})

        if (!this.user){
            this.errors.push('Usuário inválido');
            return;
        }
        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Usuário e/ou senha inválidos');
            this.user = null;
            return;
        }
    }

    async register(){
        this.validate()
        if(this.errors.length > 0) return;

        await this.userExists()
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password,salt)

        
        this.user = await LoginModel.create(this.body)
        
        
    }
    async userExists(){
        this.user = await LoginModel.findOne({email:this.body.email})
        if(this.user) this.errors.push('E-mail já cadastrado.')
    }
    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }

        if(this.body.password !== this.body.rpassword) this.errors.push('Senhas devem ser iguais.');
        
        this.body = {
        name: this.body.name,
        email: this.body.email,
        password: this.body.password,

        }
    }
    
}

module.exports = Login;