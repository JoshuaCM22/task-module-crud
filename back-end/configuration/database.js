import dotenv from "dotenv";
dotenv.config();

export const database = {
    host: process.env.SERVER,    
    user: process.env.USER,          
    password: process.env.PASSWORD,          
    database: process.env.DATABASE, 
    port : Number(process.env.DATABASE_PORT)
};