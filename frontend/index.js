import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';
import Login from './assets/modules/Login';
import Register from './assets/modules/Register';
import ContactRegister from './assets/modules/ContactRegister';

const login  = new Login('.form-login');
login.init();
const register = new Register();
register.init();
const contactRegister = new ContactRegister();
contactRegister.init();




