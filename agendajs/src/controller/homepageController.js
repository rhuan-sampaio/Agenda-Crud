const Contato = require('../models/ContatoModel')

exports.index = async function(req,res){
    try{
        const contatos = await Contato.listContact()
        res.render('index', {contatos})

    }catch(e){
        res.render('404')
    }
    
}
