// Generate Token and Set Cookie
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateTokenAndSetCookie = (res, userId)=>{
    const token = jwt.sign( { id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })

    // Set cookie
    res.cookie("token", token, {
    httpOnly: true, // accessible only by web server
    // secure: process.env.NODE_ENV !== "development", 
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    // sameSite: "strict", // prevent CSRF attacks
    sameSite: "lax", // CSRF attacks but allow sending cookies when navigating from external sites
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expires after 7 days
    });
    return token;
}
