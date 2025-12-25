const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/', authController.login);
router.post('/register', authController.register);

module.exports = router;