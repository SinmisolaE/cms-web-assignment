const User = require('../models/User');

const hasPermission = async (permission) => {
    return async(req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                success: false,
                error: 'User not authenticated.'
                });
            }
            
            // Check if user's role has the required permission
            const userPermissions = req.user.role.permissions;
            
            if (!userPermissions.includes(permission)) {
                return res.status(403).json({
                success: false,
                error: `Access denied. Requires permission: ${permission}`
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: `Internal server error occured - ${error}`
            });
        }
    }
}

module.exports = hasPermission;