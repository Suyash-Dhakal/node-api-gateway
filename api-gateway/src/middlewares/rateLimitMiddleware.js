import { incrementKey } from "../services/redisService.js";

export const rateLimiter = async (req, res, next)=>{
    try {
        const key = `rate:${req.ip}`;
        const windowSize = 60; // e.g., 60 seconds
        const rateLimit = 15; // e.g., 15 requests per window
        const request = await incrementKey(key, windowSize);
        if(request > rateLimit){
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }
        next();
    } catch (error) {
        console.error(error);
        next(); // Allow the request to proceed in case of error
    }
}