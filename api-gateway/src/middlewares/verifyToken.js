import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next)=>{
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    if(!token) return res.status(401).json({ success: false, message: 'Unauthorized'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({ success: false, message: 'Unauthorized'});
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized'});
    }
}