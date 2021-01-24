const validUrl = require('valid-url');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const routes = require('express').Router();
const appRepo = require('../services/appRepo');
const userRepo = require('../services/userRepo');

routes.get('/register', async (req, res) => {
    const appId = req.query.aid;
    const redirectUrl = req.query.r;

    if (!validUrl.isWebUri(redirectUrl)) return res.status(500).send('Error: Invalid redirect URL');

    if (!(await appRepo.activeApplicationExists(appId)))
        return res.status(500).send('Error: Invalid Application Key');

    return res.render('register', { title: 'Register' });
});

routes.post('/register', async (req, res) => {
    const appId = req.query.aid;
    const redirectUrl = req.query.r;

    if (!validUrl.isWebUri(redirectUrl)) return res.status(500).send('Error: Invalid redirect URL');

    if (!(await appRepo.activeApplicationExists(appId)))
        return res.status(500).send('Error: Invalid Application Key');

    const modelSchema = joi.object({
        firstName: joi.string().required().alphanum(),
        lastName: joi.string().required().alphanum(),
        email: joi.string().required().email({ minDomainSegments: 2 }),
        password: joi
            .string()
            .required()
            .min(4)
            .max(30),
        confirmPassword: joi.ref('password'),
    });

    const { error, value } = modelSchema.validate(req.body);
    const model = value;
    if (error) {
        console.error(error);
        return res.status(500).send('Error: Invalid form data');
    }

    if (await userRepo.getUser(appId, model.email)) {
        return res.status(500).send('Error: User already exists');
    }

    const hashedPassword = await bcrypt.hash(model.password, 10);
    await userRepo.insertUser(appId, {
        ...model,
        hashedPassword,
        isActive: true,
    });

    return res.redirect(redirectUrl);
});

routes.get('/login', async (req, res) => {
    const appId = req.query.aid;
    const redirectUrl = req.query.r;

    if (!validUrl.isWebUri(redirectUrl)) return res.status(500).send('Error: Invalid redirect URL');

    if (!(await appRepo.activeApplicationExists(appId)))
        return res.status(500).send('Error: Invalid Application Key');

    return res.render('login', { title: 'Login' });
});

routes.post('/login', async (req, res) => {
    const appId = req.query.aid;
    const redirectUrl = req.query.r;

    if (!validUrl.isWebUri(redirectUrl)) return res.status(500).send('Error: Invalid redirect URL');

    if (!(await appRepo.activeApplicationExists(appId)))
        return res.status(500).send('Error: Invalid Application Key');

    const modelSchema = joi.object({
        email: joi.string().required().email({ minDomainSegments: 2 }),
        password: joi.string().required(),
    });

    const { error, value } = modelSchema.validate(req.body);
    const model = value;
    if (error) {
        console.error(error);
        return res.status(500).send('Error: Invalid form data');
    }

    const user = await userRepo.getUser(appId, model.email);
    if (!user) {
        return res.status(500).send('Error: User does not exist');
    }

    const app = await appRepo.getApp(appId);

    const userPasswordMatch = await bcrypt.compare(model.password, user.hashed_password);
    if (userPasswordMatch) {
        var token = jwt.sign(
            {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            },
            app.private_key,
            { algorithm: 'RS256' },
        );
        return res.redirect(307, `${redirectUrl}?t=${token}`);
    } else {
        return res.status(401).send('Error: Invalid credentials');
    }
});

routes.get('/', (req, res) => {
    return res.send('Hello');
});

module.exports = routes;
