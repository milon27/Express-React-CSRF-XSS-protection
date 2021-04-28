const express = require('express')
const cookieParser = require('cookie-parser')
//const csurf = require('csurf')
const cors = require('cors')
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());


// app.use(csurf({
//     cookie: {
//         httpOnly: true,
//         maxAge: 60//60 seconds
//     }
// }));
// app.use((req, res, next) => {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     next();
// });
// app.use((err, req, res, next) => {
//     if (err.code !== 'EBADCSRFTOKEN') {
//         return next(err);
//     }
//     console.log('we got the error with csrf->EBADCSRFTOKEN');
//     res.status(403).json({
//         message: 'error'
//     });
// });


//demo token for post request
const authMid = (req, res, next) => {
    const token = req.cookies.auth
    console.log('token-' + token);
    if (token === 'jwtauthtoken') {
        next()
    } else {
        res.status(500).send("unauthorized")
    }
}

//in body : {_csrf: Cookies.get('XSRF-TOKEN')}
app.post('/post', authMid, (req, res) => {

    console.log("req.headers - ", req.headers['x-xsrf-token']);
    res.json({ name: "-posted" })
});

//login
app.get('/', (req, res) => {
    res.cookie('auth', 'jwtauthtoken', {
        httpOnly: true
    })
    res.json({ name: "-milon" })
});

app.get('/logout', (req, res) => {
    res.cookie('auth', '', {
        httpOnly: true
    })
    res.json({ name: "" })
});
//X-XSRF-TOKEN
app.listen(2727, () => console.log('2727 running..'));
