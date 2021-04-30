const express = require('express')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const cors = require('cors')
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());


const cookieOption = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
}

const csrfPro = csurf({
    cookie: { cookieOption }
})

const ignoreMethods = [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
]

app.use(csurf({
    cookie: cookieOption,
    ignoreMethods
}))

app.all('*', (req, res, next) => {
    const token = req.csrfToken()
    res.cookie('XSRF-TOKEN', token);
    next();
});

app.use((err, req, res, next) => {
    console.log("req.headers 1 - ", req.headers['x-xsrf-token']);
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }
    console.log(err);
    res.status(403).json({
        message: 'error'
    });
});


//demo token for post request
const authMid = (req, res, next) => {
    const token = req.cookies.auth
    console.log('jwt token=' + token);
    if (token === 'jwtauthtoken') {
        next()
    } else {
        res.status(500).send("unauthorized")
    }
}


// app.get('/refresh-token', (req, res) => {
//     res.json({ name: "empty" })
// });

//in body : {_csrf: Cookies.get('XSRF-TOKEN')}
app.post('/post', csrfPro, authMid, (req, res) => {
    console.log("req.headers - ", req.headers['x-xsrf-token']);
    res.json({ name: "-posted" })
});

//login
app.get('/login', (req, res) => {
    res.cookie('auth', 'jwtauthtoken', cookieOption)
    res.json({ name: "-milon" })
});

app.get('/logout', (req, res) => {
    res.cookie('auth', '', cookieOption)
    res.clearCookie('_csrf')
    res.clearCookie('XSRF-TOKEN')
    res.json({ name: "" })
});
//X-XSRF-TOKEN
app.listen(2727, () => console.log('2727 running..'));
