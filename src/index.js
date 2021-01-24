require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

const rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

app.use(morgan('dev'));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
