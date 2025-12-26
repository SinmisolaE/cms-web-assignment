const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');

const hasPermission = require('../middleware/permissionMiddleware');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);


router.get('/', hasPermission('view_roles'), roleController.getAllRoles);

router.post('/add', hasPermission('create_role'), roleController.createRole);

router.put('/:id', hasPermission('edit_role'), roleController.updateRole);

router.delete('/:id', hasPermission('delete_role'), roleController.deleteRole);

module.exports = router;