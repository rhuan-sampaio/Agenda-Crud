const { restart } = require('nodemon')
const Login = require('../models/LoginModel ')
const Contato = require('../models/ContatoModel')
exports.index = (req,res) =>{
    if(req.session.user){
        res.redirect('./logged')
        return
    }
    res.render('login')
}

exports.registerIndex = (req,res)=>{
    if(req.session.user){
        res.redirect('./logged')
        return
    }
    res.render('register')
}
exports.loggedIndex = async function (req,res){
    try{
        if(req.session.user){
            const contatos = await Contato.listOwnerContact(req.session.user)
            res.render('logged', {contatos})
            return
        }
        res.render('login')

    }catch(e){
        console.log(e)
        res.render('404')

    }
    
}

//post
exports.register = async function (req,res) {
    const login = new Login(req.body)
    try{
       await login.register()
       if(login.errors.length > 0){
           req.flash('errors', login.errors)
           req.session.save(function(){
               return res.redirect('./index');
           });
           return
       }
       req.flash('success','Usuário cadastrado com sucesso.')
       req.session.save(()=>{
        return res.redirect('./index')
       })

    }catch(e){
        console.log(e)
        return res.render('404')
    }
   
}

exports.enter = async function(req,res){
    const login = new Login(req.body)
    try{
       await login.enter()
       if(login.errors.length > 0){
           req.flash('errors', login.errors)
           req.session.save(function(){
               return res.redirect('./index');
           });
           return
       }
       req.flash('success','Login efetuado com sucesso!')
       req.session.user = login.user;
       req.session.save(()=>{
        return res.redirect('./index')
       })

    }catch(e){
        console.log(e)
        return res.render('404')
    }
}

exports.logout = function(req,res){
    req.session.destroy();
    res.redirect('/')
}