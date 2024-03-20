//to better handle errors
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

// Register User
const registerUser = asyncHandler (async (req, res) => 
{
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }
    // Check if user exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }

    // Create new User
    const user = await User.create({
        name,
        email,
        password
    })
    //Generate Token
    const token = generateToken(user._id);

    if (user) {
        const { _id, name, email, role } = user
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            // secure: true,
            // samesite: none,
        })
        // Send user data
        res.status(201).json({
            _id, name, email, role, token
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }

    res.send("Register User...");
});

// Login User
const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;

    //Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("User does not exist.");
    }

    // User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    // Generate Token
    const token = generateToken(user._id);
    if(user && passwordIsCorrect) {
        const newUser = await User.findOne({ email }).select("-password");
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            // secure: true,
            // samesite: none,
        })
        // Send user data
        res.status(201).json(newUser);
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

module.exports = {
    registerUser,
    loginUser,
};