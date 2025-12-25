const Role = require('../models/Role');

// Create a new role
const createRole = async (req, res) => {
    try {
        const {name, permissions, description} = req.body;

        if (name === null || permissions === null 
            || name === string
        )
        {
            return res.status(400).json({
                success: false,
                error: "Provide required inputs"
            });
        }

        const role = new Role({
            name,
            permissions,
            description
        });

        await role.save();

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            role: {
                id: role._id,
                name: role.name,
                permissions: role.permissions
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}


// Get all roles
const getAllRoles = async () => {
    try {
        const roles = await Role.find();

        return res.status(200).json({
            success: true,
            roles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        });
    }
}

// Update an existing role
const updateRole = async (req, res) => {
    try {
        const {id, name, permissions} = req.body;

        if (id == null || ((name == null) && permissions == null)) {
            return res.status(400).json({
                success: false,
                error: 'Provide required credentials'
            });
        }

        const role = await Role.findByIdAndUpdate(id, {name, permissions});

        if (!role) {
            return res.status(404).json({
                success: false,
                error: 'Role not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Role updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error has occurred - ${error}`
        })
    }
}
