# Aplicacion sencilla con autentificación sencilla con roles de usuario

_Aplicación con un sistema de autenticación básico desarrollado con Node.js y Express, utilizando EJS como motor de plantillas y SQLite como base de datos._
_Incluye gestión de sesiones mediante cookies, validación de usuarios y un sistema de roles (usuario / administrador) con zonas privadas protegidas según el rol._

## Explicación del uso de cada parte

_Explicación del uso de cada parte (plantillas, base de datos, autenticación, cookies, roles y zonas privadas)._

### Plantillas (EJS)

_Las vistas se generan usando EJS, lo que permite incluir fragmentos comunes (header y footer) y mostrar información dinámica del usuario._
_Estructura:_

```
views/
 ├── partials/
 │   ├── footer.ejs
 │   └── header.ejs
 ├── admin.ejs
 ├── index.ejs
 ├── login.ejs
 └── user.ejs
```

### Base de datos (SQLite)

Se usa genera un archivo database.sqlite con una tabla usuarios que contiene:

- id
- username
- password (encriptada)
- role (user / admin)

El archivo init-db.js crea la base de datos y la tabla si no existe.

```
const sentencia = db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT unique,
    password TEXT,
    role TEXT
)`);
```

### Autenticación

_El usuario inicia sesión desde login.ejs.
Las credenciales se verifican con la base de datos.
Si son correctas, se crea una sesión con los datos del usuario._

```
app.post("/login", (req, res) => {
  const { user, password } = req.body;
  const seleccionar = db.prepare(`select * from users where username = ?`);
  const fila = seleccionar.get(user);

  if (fila) {
    const username = fila.username;
    const pwd = fila.password;

    if (bcrypt.compareSync(password, pwd)) {
      console.log("Login correcto de " + username);
      res.cookie("user", user);
      res.redirect(fila.role);
    } else {
      res.status(401).redirect("login");
    }
  }
});
```

### Cookies

_Las sesiones se gestionan mediante cookies utilizando express-session._
_Permiten mantener el estado del usuario entre peticiones._

```
res.cookie("user", user);
```

### Roles

_Cada usuario tiene un rol asignado:_

- user → acceso a /user
- admin → acceso a /admin

_El rol se comprueba antes de permitir el acceso a cada zona._

```
isUser = (req, res, next) => {
  if (req.cookies && req.cookies.user == "user") {
    return next();
  }
  if (req.cookies && req.cookies.user == "admin") {
    res.redirect("/admin");
  }
  res.redirect("/login");
};

isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user === "admin") {
    return next();
  }

  if (req.cookies && req.cookies.user == "user") {
    res.redirect("/user");
  }

  res.redirect("/login");
};
```

## Capturas de pantalla

### Página pública

![Página principal](/screenshots/login.png)

### Zona de usuario

![Zona usuario](/screenshots/user.png)

### Zona de administrador

![Zona admin](/screenshots/admin.png)

## Autor

- **Bryan Chuquimarca Castillo** - _Monolito_ - [Perfil de Github](https://github.com/BryanJChuquimarca)

Repositorio del proyecto [Repositorio Monolito](https://github.com/BryanJChuquimarca/monolito)
