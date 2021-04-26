const express = require('express')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const cors = require('cors')

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
//{
// key: '_csrf-milon27',
//     path: '/context-route',
//         httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//                 maxAge: 3600 // 1-hour
//     }
//main cookie part
//(whenever we have a form in client- will generate a csrf token for next 10 minutes)
// const csurfMid = csurf({
//     cookie: {
//         httpOnly: true,
//         secure: false,
//         maxAge: 60//1mint // 3600 // 1-hour
//     }
// })
// app.use(csurfMid);

// //set a xsrf-token(body part) for all request from request csrf token. 
// app.all("*", (req, res, next) => {
//     res.cookie("XSRF-TOKEN", req.csrfToken());//we can get this on javascript Cookies.get('XSRF-TOKEN')
//     next();
// });


//demo token for post request
const authMid = (req, res, next) => {
    const token = req.cookies.auth
    console.log('token-' + token);
    if (token === 'someauthtoken') {
        next()
    } else {
        res.status(400).send("unauthorized")
    }
}

//in body : {_csrf: Cookies.get('XSRF-TOKEN')}
app.post('/post', authMid, (req, res) => {
    res.json({ name: "posted" })
});

app.get('/', (req, res) => {
    res.cookie('auth', 'someauthtoken', {
        httpOnly: true
    })
    res.json({ name: "milon" })
});

app.get('/logout', (req, res) => {
    res.cookie('auth', '', {
        httpOnly: true
    })
    res.json({ name: "milon" })
});
//X-XSRF-TOKEN
app.listen(2727, () => console.log('2727 running..'));
