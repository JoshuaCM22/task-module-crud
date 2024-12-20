import mysql from "mysql2/promise"; // Import the promise-based mysql2 library
import { database } from "../configuration/database.js";
import colors from "colors";

let connectionPool; 

async function setDatabaseConnection(url, environment, portNumber) {
    try {

      connectionPool = mysql.createPool({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database,
        port: database.port,
        waitForConnections: true,
        connectionLimit: 10, // Maximum number of connections in the pool
        queueLimit: 0        // Unlimited queued requests
      });

        await queryDatabase(`SELECT NOW() AS 'current_time'`);
        console.log(`--------------------------------------------------------------------------------------------------------`.yellow);
        console.log(`--------------------------------------------------------------------------------------------------------`.yellow);
        console.log(`                          Successfully connected in my sql database                                 `.yellow);
        console.log(`                          Server running in ${environment} mode on port ${portNumber}                   `.yellow);
        console.log(`                          Link: ${url}                                                                  `.yellow);
        console.log(`--------------------------------------------------------------------------------------------------------`.yellow);
        console.log(`--------------------------------------------------------------------------------------------------------`.yellow);
    }
    catch (error) {
        console.log("An error has occured in setDatabaseConnection(url, environment, portNumber). Error Message: " + error.message);
    }
}

async function queryDatabase(query, params = []) {
    let connection;
    try {
      connection = await connectionPool.getConnection();
      const [rows] = await connection.execute(query, params);
      return rows; 
    } catch (error) {
      throw error; 
    } finally {
      if (connection) connection.release(); 
    }
  }

import jwt from "jsonwebtoken";
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};

function decode(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
}

function toBoolean(stringVariable) {
    return (stringVariable === 'true');
}

function hasValidValue(value){
  return (value !== undefined && value !== null);
}

function isArray(value) {
  return (Array.isArray(value));
}

function isNotEmptyArray(value){
  return (isArray(value) && value.length > 0);
}

function getUserID(authorization){
  if (!authorization || !authorization.startsWith('Bearer ')) return res.status(401).json("Access token is missing or invalid.");

  // Extract the token (remove 'Bearer ' prefix)
  const token = authorization.split(' ')[1];
  const decodedValue = decode(token);
  return decodedValue[0].user_id;
}

export default {
    toBoolean,
    setDatabaseConnection,
    queryDatabase,
    generateToken,
    decode,
    hasValidValue,
    isArray,
    isNotEmptyArray,
    getUserID
}