const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);

router.get('/:role', userController.getUsersByRole);

router.delete('/:id', userController.deleteUser);

module.exports = router;