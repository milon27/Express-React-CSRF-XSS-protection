const express = require('express')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//{
// key: '_csrf-milon27',
//     path: '/context-route',
//         httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//                 maxAge: 3600 // 1-hour
//     }
//main cookie part
//(whenever we have a form in client- will generate a csrf token for next 10 minutes)
const csurfMid = csurf({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60//1mint // 3600 // 1-hour
    }
})
app.use(csurfMid);

//set a xsrf-token(body part) for all request from request csrf token. 
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());//we can get this on javascript Cookies.get('XSRF-TOKEN')
    next();
});

//in body : {_csrf: Cookies.get('XSRF-TOKEN')}
app.post('/post', (req, res) => {
    res.json({ done: req.body })
});

app.get('/', (req, res) => res.send("milon"));

app.listen(3000);