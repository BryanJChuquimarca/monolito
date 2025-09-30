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

isUser = (req, res, next) => {
    if (req.cookies && req.cookies.user === 'user') {
        return next();
    }
    res.redirect('/login');
}

isAdmin = (req, res, next) => {
    if (req.cookies && req.cookies.user === 'admin') {
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

    if (user == 'user' && password == 'user') {
        console.log('Login correcto')
        res.cookie('user', user);
        res.redirect("home");

    } else if (user == 'admin' && password == 'admin') {
        console.log('Login correcto')
        res.cookie('user', user);
        res.redirect("admin");
    } else {
        res.status(401).redirect("login")
    }

})

app.get('/home', isUser, (req, res) => {
    res.render('home');

})

app.get('/admin', isAdmin, (req, res) => {
    res.render('admin');

})

app.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('login');

})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})