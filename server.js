require('dotenv').config();
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const routes = require('./router')
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');

mongoose.connect(process.env.CONNECTIONSTRING,{ useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false})
    .then(()=>{
        console.log('Connected to DB')
        app.emit('ready')
    })
    .catch(e=>console.log(e));

const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const {globalMiddleWare,checkCsrfError,csrfMiddleware} = require('./src/middleware/middleware')

app.use(helmet());


app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'public')))
app.use(express.static(path.resolve(__dirname,'public','assets','css')))

const sessionOptions = session({
    secret: 'asfghjkl2313',
    store: MongoStore.create({mongoUrl:process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions);
app.use(flash())

app.set('views', path.resolve(__dirname,'src','views'))
app.set('view engine', 'ejs');

app.use(csrf());


app.use(checkCsrfError);
app.use(globalMiddleWare);
app.use(csrfMiddleware);



app.use(routes);

app.use(function(req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
  
  });

app.on('ready', ()=>{
    app.listen(3000, () => {
    console.log('http://localhost:3000');
    console.log('Server started at port 3000');
});
})
