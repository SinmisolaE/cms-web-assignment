const User = require('../models/User');


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-hashedPassword')
            .populate('role', ('name permissions'));

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Get users by role
const getUsersByRole = async (req, res) => {
    try {
        const roleName = req.params.role;

        const users = await User.find()
            .select('-hashedPassword')
            .populate({
                path: 'role',
                select: 'name permissions',
                match: {name: roleName}
        });

        // Filter null presence for unmatched roles
        const filteredUsers = users.filter(user => user.role !== null);

        return res.status(200).json({
            success: true,
            users: filteredUsers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (id === null) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
            });
        }

        const role = await User.findByIdAndDelete(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

module.exports = {
    getAllUsers,
    getUsersByRole,
    deleteUser
}