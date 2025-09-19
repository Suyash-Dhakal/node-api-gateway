import { User } from './../models/user.js'; 
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../services/authService.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success:false, message: "All fields are required" });
        }

        // Check if user already exists
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ success:false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // jwt token
        generateTokenAndSetCookie(res, newUser.id);

        res.status(201).json({ success:true, message: "User created successfully", userId: newUser.id });

    } catch (error) {
        res.status(500).json({ success:false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success:false, message: "Invalid credentials" });
        }
        // jwt token
        generateTokenAndSetCookie(res, user.id);

        res.status(200).json({ success:true, message: "Logged in successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ success:false, message: "Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
        });
        res.status(200).json({ success:true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success:false, message: "Server error" });
    }
};