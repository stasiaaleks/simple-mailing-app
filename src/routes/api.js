const express = require('express');
const ContactController = require('../controllers/contactController');
const TemplateController = require('../controllers/templateController');
const EmailController = require('../controllers/emailController');

const contactController = new ContactController();
const templateController = new TemplateController();
const emailController = new EmailController();

const routes = [
  ['get', '/contacts', contactController, 'getAll'],
  ['get', '/contacts/:id', contactController, 'getById'],
  ['post', '/contacts', contactController, 'create'],
  ['put', '/contacts/:id', contactController, 'update'],
  ['delete', '/contacts/:id', contactController, 'delete'],
  ['get', '/templates', templateController, 'getAll'],
  ['get', '/emails', emailController, 'getAll'],
  ['post', '/email/send', emailController, 'send'],
];

const router = express.Router();
router.use(express.json());

routes.forEach(([method, path, controller, action]) => {
  router[method](path, (req, res) => controller[action](req, res));
  console.log(`Registered route: [${method.toUpperCase()}] ${path}`);
});

module.exports = router;
