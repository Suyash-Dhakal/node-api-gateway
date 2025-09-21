import { client } from '../../config/redisConfig.js';

export const incrementKey = async (key, windowSize) => {
    const count = await client.incr(key);
    if(count===1){
        await client.expire(key, windowSize);
    }
    return count;
}