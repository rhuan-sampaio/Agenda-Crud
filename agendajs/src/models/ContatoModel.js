const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    name: {type: String, required:true},
    lastname: {type: String, required:false, default:''},
    email: {type: String, required:false, default:''},
    number: {type: String, required:false, default:''},
    createdAt: {type: Date, default: Date.now()},
    owner:{type:String},
    oName:{type:String}


})
ContatoSchema.query.byName = function(name){
    return this.where({name: new RegExp(name,'i')})
};
const ContatoModel = new mongoose.model('contato',ContatoSchema);

class Contato {
    constructor(body,session,oName){
        this.body = body;
        this.errors = [];
        this.contato = null;
        this.oName = oName;
        this.owner = session;
        
    }
    validate(){
        this.cleanUp()
        if(!this.body.name) this.errors.push('Nome é um campo obrigatório.')
        if(this.body.email && !validator.isEmail(this.body.email)){
            this.errors.push('Insira um e-mail válido.')
        }
        if(!this.body.email && !this.body.number) this.errors.push('Insira ao menos um Telefone ou E-mail.')

    }
    async register(){
        this.validate();
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.create({
            name:this.body.name,
            lastname:this.body.lastname,
            email:this.body.email,
            number:this.body.number,
            createdAt:this.body.createdAt,
            owner: this.owner,
            oName:this.oName
            
        })

    }

    cleanUp(){
        for (let field in this.body){
            if(typeof this.body[field] !== 'string'){
                this.body[field] = '';
            }
        }
        this.body = {
            name:this.body.name,
            lastname:this.body.lastname,
            email:this.body.email,
            number:this.body.number,
            createdAt:this.body.createdAt,
            owner: this.owner,
            onwerName:this.ownerName
            
        }

    }

    static async searchContact(id){
        if(typeof id !== 'string') return;
        const contact = await ContatoModel.findById(id)
        return contact
    }

    static async listContact(){
        const contact = await ContatoModel.find().sort({createdAt : -1});
        return contact;
    }
    static async listOwnerContact(id){
        const contact = await ContatoModel.find({owner:id}).sort({createdAt : -1});
        return contact;
    }

    static async deleteContact(id,userID){
        const contact = await ContatoModel.findOne({_id:id,owner:userID})
        if(contact){
            await ContatoModel.findByIdAndDelete(contact._id)
        } 
        return contact
        
        
    }

    async edit(id, body){
        if(typeof id !== 'string') return;
        if (this.errors.length > 0) return;
        await ContatoModel.findByIdAndUpdate(id, body, {new:true})
    

    }
  
    static async searchBar(query){
        if (typeof query !== 'string') return
        let result = await ContatoModel.find().byName(query)
        return result
        
    }
}

module.exports = Contato;