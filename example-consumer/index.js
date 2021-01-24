const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3009;

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmEYpYc6pV9lj9w72487w
6Wi0juGn2FT/rCcOrrcdfFw4erPmEd7v/5DcG8UINMquICYMN9OZgeeJ+hxq4sRM
xGPdGEojow4MA+jZjoh+g/sfAZYpMfA/FL5teUi33QOD/d1HjqGdUpBGbnb2UqxM
/7KiZmg/45jAfeQFmMM4lMcrBViL6x9lGK43W+wsKPoF9abEUjUt4eAM2bdNWawi
VszQJ1f7R4/HrwcjQrDIxm8s/zcQy9QsneQalBdvQVDkLSciLnnL6AH/YfNUodH/
zwpzclv4wLvpc7zCuA1FzUHMyZwNXJqIzyOzlBi/tOugzCCz95NOuIVGHrneShkz
1wIDAQAB
-----END PUBLIC KEY-----`;

const sess = {
    secret: 'blah blah example',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
};

app.use(session(sess));

app.get('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/');
});

app.post('/login-callback', async (req, res) => {
    const t = req.query.t;
    const user = await jwt.verify(t, publicKey);
    req.session.user = user;
    return res.redirect('/');
});

app.get('/', (req, res) => {
    res.render('home', { title: 'ACME Corp. Website', user: req.session.user });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
