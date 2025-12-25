const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const { initializeRoles } = require('./utils/roleInitializer');

const authRoutes = require('./routes/authRoute');
const roleRoutes = require('./routes/roleRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// auth
app.use('/auth', authRoutes);

// roles endpoint for super admin
app.use('/roles', roleRoutes);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    app.listen(PORT);
    console.log(`Database connected - Server running on port ${PORT}`);
    await initializeRoles();
}).catch(err => {
    console.error('Database connection failed:', err);
});


