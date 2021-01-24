require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const session = require('express-session');

// const routes = require('./routes');
const db = require('./services/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.CLIENT_APP_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    }),
);

const rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(expressLayouts);

app.use(morgan('dev'));

const sess = {
    store: new (require('connect-pg-simple')(session))(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
};
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));

app.get('/', (req, res) => {
    return res.send('Ingo');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
