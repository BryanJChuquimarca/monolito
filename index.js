const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index', { title: 'titulo', name: "nombre" });
})

isAuth = (req, res, next) => {
    if (req.cookies && req.cookies.user) {
        return next();
    }
    res.redirect('/login');
}

isAdmin = (req, res, next) => {
    if (req.cookies && req.cookies.user) {
        return next();
    }
    res.redirect('/login');
}



//gestion de la vista
app.get('/login', (req, res) => {
    res.render('login');
})

//gestion de los paramentros post
app.post('/login', (req, res) => {
    const { user, password } = req.body;

    if (user == 'admin' && password == 'admin') {
        console.log('Login correcto')
        res.cookie('user', user); //opcions -js no secure si
        res.redirect("home");

    } else {
        res.status(401).redirect("login")
    }

})

app.get('/home', isAuth, (req, res) => {
    res.render('home');

})

app.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('login');

})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})