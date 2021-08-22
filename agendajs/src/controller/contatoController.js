const { render } = require('ejs')
const { restart } = require('nodemon')
const Contato = require('../models/ContatoModel')

exports.contatoIndex = (req,res)=>{
    res.render('contato')
}


exports.contatoRegister = async function(req,res){
    const contato = new Contato(req.body,req.session.user._id,req.session.user.name)
    try{
        await contato.register()
        if(contato.errors.length > 0){
            req.flash('errors',contato.errors);
            req.session.save(()=> res.redirect('./index'));
            return;
        }
        req.flash('success','Contato cadastrado com sucesso.')
        req.session.save(()=> res.redirect(`./index`));
            return;

    }catch (e){
        console.log(e);
        return res.render('404');
    }
}

exports.contatoEdit = async function(req,res){
    const session = req.session.user
    const cValidation = await Contato.searchContact(req.params.id);
   
    if (session._id !== cValidation.owner){
        req.flash('errors','Contato não pertencente ao usuário');
            req.session.save(()=> res.redirect('back'));
            return;
    }
    if(!req.params.id) return res.render('404');
    const obj = await Contato.searchContact(req.params.id)
    const contato = new Contato(obj); 
    res.render('contatoedit',{contato:contato.body, id:req.params.id})
    
    }

exports.contatoEditUpdate = async function(req,res){
        const session = req.session.user
        const contato = new Contato(req.body)
        await contato.edit(req.params.id, req.body)
        if(contato.errors.length > 0){
            req.flash('errors',contato.errors);
            req.session.save(()=> res.redirect('./index'));
            return;
        }
        req.flash('success','Contato editado com sucesso.')
        req.session.save(()=> res.redirect(`./${req.params.id}`));
            return;

  
}
exports.contatoDelete = async function(req,res){
    const session = req.session.user
    try{
        const id = req.params.id
        const contatoDeleted = await Contato.deleteContact(id,session._id)
        if(!contatoDeleted){
            req.flash('errors','Contato não pertence ao seu usuário');
            return req.session.save(()=> res.redirect('back'));
            
        }else{
        req.flash('success','Contato apagado com sucesso.')
        req.session.save(()=> res.redirect('back'))
        return;
        }
    }catch(e){
        console.log(e)
        return res.render('404')
    }
}

exports.search =  async function(req,res){
    try{
        const contatos = await Contato.searchBar(req.query.searchbar)
        res.render('search',{contatos})

    }catch (e){
        console.log(e)
        res.render('404')
    }
   
   
}