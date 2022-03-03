import { createClient } from "redis"

const redis_client = createClient({
    url: "redis://"+"redis-15830.c264.ap-south-1-1.ec2.cloud.redislabs.com:15830",
    password: "R3Y7AVrGi0gzkJYppXHo76Q4UbcE8qbF"
});

redis_client.on('error', (err) => console.log('Redis Client Error', err));

export { redis_client }