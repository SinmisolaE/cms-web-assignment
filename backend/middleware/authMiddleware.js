const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ensure the jwt is valid - 
const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) 
        {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const isValid = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        console.log(`JWT.VERIFU RESULT: ${isValid}`);

        const user = await User.findById(isValid.id)
            .select('-password -refreshToken')
            .populate('role', ('name, permissions'));
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found. Token invalid.'
            });
        }

        req.user = user;

        next();
    }catch (error) {
        console.error('Token verification error:', error.message);
        
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Access token expired. Please refresh your token.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token. Please login again.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Authentication failed.'
        });    
    }
}

module.exports = verifyToken;