import helperMethods from "../utility/helperMethods.js";

async function getUser(username, password) {
    const query = `SELECT 
                        ID AS "user_id", 
                        TRIM(Username) AS "username"
                    FROM task_module.users
                    WHERE username = ? 
                      AND password = ?
                    ORDER BY ID ASC
                    LIMIT 1`;
    return await helperMethods.queryDatabase(query, [username, password]);
}


export default {
  getUser
}