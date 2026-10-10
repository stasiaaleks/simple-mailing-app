const express = require('express');
const RouteRegistrar = require('../utils/routeRegistrar');
const ContactController = require('../controllers/contactController');
const TemplateController = require('../controllers/templateController');
const EmailController = require('../controllers/emailController');

const router = express.Router();
const jsonParser = express.json();
const registrar = new RouteRegistrar(router, [jsonParser]);

// Initialize controllers
const contactController = new ContactController();
const templateController = new TemplateController();
const emailController = new EmailController();

// Contacts endpoints
registrar.get('/contacts', (req, res, next) => contactController.getAll(req, res, next));
registrar.get('/contacts/:id', (req, res, next) => contactController.getById(req, res, next));
registrar.post('/contacts', (req, res, next) => contactController.create(req, res, next));
registrar.put('/contacts/:id', (req, res, next) => contactController.update(req, res, next));
registrar.delete('/contacts/:id', (req, res, next) => contactController.delete(req, res, next));

// Templates endpoint
registrar.get('/templates', (req, res, next) => templateController.getAll(req, res, next));

// Email endpoint
registrar.post('/email/send', (req, res, next) => emailController.send(req, res, next));

module.exports = router;
