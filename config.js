import dotenv from 'dotenv';

//Running variables
dotenv.config();

module.exports = {
    port: process.env.PORT,
    database: process.env.MONGO_DB
}

// Better way would be 
// const result = dotenv.config();
// if(result.error){
//     throw new Error(result.error);
// }
// const {parsed: envs} = result;
// module.exports = envs