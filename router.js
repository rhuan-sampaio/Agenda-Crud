const express = require('express');
const router = express.Router();
const homepageController = require('./src/controller/homepageController')
const loginController = require('./src/controller/loginController')
const contatoController = require('./src/controller/contatoController')
const {loginRequired} = require('./src/middleware/middleware')
const {userSearch} = require('./src/middleware/middleware')

//treat the data from post
router.use(express.urlencoded({ extended: true }));

//home router
router.get('/', homepageController.index);


//login router
router.get('/login/index', loginController.index);
router.post('/login/register', loginController.register);
router.get('/login/register', loginController.registerIndex)
router.get('/login/logged', loginController.loggedIndex)
router.post('/login/enter',loginController.enter);
router.get('/login/logout',loginController.logout);

router.get('/search/index',userSearch, contatoController.search);
//contact router
router.get('/contato/index',loginRequired ,contatoController.contatoIndex);
router.post('/contato/register',loginRequired, contatoController.contatoRegister);

router.get('/contato/index/:id',loginRequired, contatoController.contatoEdit);
router.post('/contato/index/:id',loginRequired, contatoController.contatoEditUpdate);
router.get('/contato/delete/:id',loginRequired, contatoController.contatoDelete);



//search router



module.exports = router;