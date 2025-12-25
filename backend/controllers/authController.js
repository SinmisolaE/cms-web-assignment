const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// generating jwt for auth
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        {id: userId},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '45m'}
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_TOKEN,
        {expiresIn: '7d'}
    );

    return {accessToken, refreshToken};
}


// User Login
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log(`${email} : ${password}`);

        if ((email === null) || (password == null) || (email === "") || password == "") {
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        const user = await User.findOne({ email })
            .populate('role');

        

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid email or password' 
            });
        }

        // Generate tokens
        const tokens = generateTokens(user._id);

        res.json({
            success: true,
            message: 'Login successfull',
            user: {
                id: user._id,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role.name
            },
            tokens
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Server error during Login ${error}`
        });
    }



}

const register = async (req, res) => {
    try {

        const {firstName, lastName, email, password, roleName} = req.body;

        if ((firstName === null) || lastName===null
            || email===null || password===null || roleName === null
            || (firstName === "") || lastName===""
            || email==="" || password==="" || roleName === "") {

                return res.status(400).json({
                    success: false,
                    error: 'Missing credentials'
                });
            }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success:false,
                error: 'Email already exists'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be atleast 6 characters'
            });
        }

        const role = await Role.findOne({ name: roleName});

        if (!role) {
            return res.status(400).json({
                success: false,
                error: 'Role not found'
            });
        }

        // generate hash of password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            hashedPassword,
            role: role._id
        });

        const tokens = generateTokens(user._id);

        await user.save(user);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                fullName: `${user.firstName} ${user.lastName}`,
                role: user.role.name
            },
            tokens
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server error occured during Registration: ${error}`
        });

    }


}

module.exports = {login, register};