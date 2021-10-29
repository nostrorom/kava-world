// import dotenv from 'dotenv';
// dotenv.config();

// import {env} from './env';

// let go = process.env.TEST

// console.log('🥩', go)

// let fetchedPosts = ["hi"]
// let hum = '4'
let hum = process.env.AATEST

console.log(hum)

export const get = async () => {

    return {
        body: {
            test: hum,
            ho: "hi"
        }
    };
};