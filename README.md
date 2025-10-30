# Aplicacion sencilla con autentificación sencilla con roles de usuario

_Aplicación con un sistema de autenticación básico desarrollado con Node.js y Express y PostgreSQL._
_Son 4 contenedores dos de App y dos de BBDD las cuales utilizan el mismo volumen._

### Organización

_Las vistas se generan usando EJS, lo que permite incluir fragmentos comunes (header y footer) y mostrar información dinámica del usuario._
_Estructura de app:_

```
app/
├── views/
│     ├── partials/
│     │   ├── footer.ejs
│     │   └── header.ejs
│     ├── admin.ejs
│     ├── index.ejs
│     ├── login.ejs
│     └── user.ejs
├──index.js
└──Dockerfile
```

_Estructura de bbdd:_

```
bbdd/
├──Dockerfile
└──init-db.js
```

_El proyecto se divide en dos imagenes una de app y otra de bbdd, la de app contiene la aplicacion de node.js, la autentificacion y los roles y registro.Bbdd contiene la instalacion del servidor de postgres y la instalacion de la base de datos._

### Pasos para la ejecución con Docker

_Se configura la red y el volumen:_

```
docker network create mi_red
docker volume create datos_postgres
```

_Se contrulle las imagenes:_

```
docker build -t monolito-postgres ./bbdd
docker build -t monolito-node ./app
```

_Se ejecuta los contenedores:_
bbdd(primer contenedor):

```
docker run -d --name monolito_postgres_1 --network mi_red -v datos_postgres:/var/lib/postgresql/data monolito-postgres
```

bbdd(segundo contenedor):

```
docker run -d --name monolito_postgres_2 --network mi_red -v datos_postgres:/var/lib/postgresql/data monolito-postgres
```

App(primer contenedor):

```
docker run -d --name monolito_app_1 --network mi_red --env DB_HOST=monolito_postgres_1 -p 3000:3000 monolito-node
```

App(segundo contenedor):

```
docker run -d --name monolito_app_2 --network mi_red --env DB_HOST=monolito_postgres_2 -p 3001:3000 monolito-node
```

_Acceso:_

App 1:
[http://localhost:3000](http://localhost:3000)
App 2:
[http://localhost:3001](http://localhost:3001)

### Autenticación

_El usuario inicia sesión desde login.ejs.
Las credenciales se verifican con la base de datos.
Si son correctas, se crea una sesión con los datos del usuario._

```
app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  const seleccionar = await pool.query(
    'SELECT username, password, role FROM users WHERE username = $1',
    [user],
  );
  const fila = seleccionar.rows[0];

  if (fila) {
    const username = fila.username;
    const pwd = fila.password;

    if (await bcrypt.compareSync(password, pwd)) {
  console.log('Login correcto de ' + username);
  res.cookie('user', JSON.stringify({ username: fila.username, role: fila.role }));
  if (fila.role === 'admin') {
    res.redirect('/admin');
  } else {
    res.redirect('/user');
  }
} else {
  res.status(401).redirect('/login');
}

  }
});
```

### Cookies

_Las sesiones se gestionan mediante cookies utilizando express-session._
_Permiten mantener el estado del usuario entre peticiones._

```
res.cookie('user', JSON.stringify({ username: fila.username, role: fila.role }));
```

### Roles

_Cada usuario tiene un rol asignado y se verica en cada solicitud a una ruta:_

- admin → acceso a /admin
- user(rol por defecto para nuevos usuarios) → acceso a /user

_El rol se comprueba antes de permitir el acceso a cada zona._

```
const isUser = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    const userCookie = JSON.parse(req.cookies.user);
    if (userCookie.role === 'user') {
      return next();
    }
    if (userCookie.role === 'admin') {
      return res.redirect('/admin');
    }
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    const userCookie = JSON.parse(req.cookies.user);
    if (userCookie.role === 'admin') {
      return next();
    }
    if (userCookie.role === 'user') {
      return res.redirect('/user');
    }
  }
  res.redirect('/login');
};
```

## Repositorio

[Repositorio en la rama 2_capas](https://github.com/BryanJChuquimarca/monolito/tree/2_capas)
