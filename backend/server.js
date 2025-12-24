const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Test
app.get('/', (req, res) => {
    res.send("CMS running successfully");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
    app.listen(PORT);
}).catch(err => {
    console.error('Database connection failed:', err);
});


