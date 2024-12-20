import helperMethods from "../utility/helperMethods.js";

async function getTasks(userID) {
    const query = `SELECT 
                   T.ID AS "task_id",
                   TRIM(T.Title) AS "title",
                   TRIM(T.Description) AS "description",
                   (DATE_FORMAT(CONVERT_TZ(T.DueDate, '+00:00', @@session.time_zone), '%b %d, %Y')) AS "due_date",
                   (CASE
                        WHEN T.Status = 1 THEN 'Pending'
                        WHEN T.Status = 2 THEN 'In Progress'
                        WHEN T.Status = 3 THEN 'Completed'
                   END) AS 'status',
                   CONCAT(TRIM(U.LastName), ', ', TRIM(U.FirstName), ' ', TRIM(U.MiddleName)) AS "created_by"
                   FROM tasks AS T
                   INNER JOIN users AS U
			       ON U.ID = t.CreatedBy
                   WHERE T.CreatedBy = ?
                   ORDER BY T.ID ASC`;
    return await helperMethods.queryDatabase(query, [userID]);
}

async function getTask(userID, taskID) {
    const query = `SELECT
                   T.ID AS "task_id",
                   TRIM(T.Title) AS "title",
                   TRIM(T.Description) AS "description",
                   (DATE_FORMAT(CONVERT_TZ(T.DueDate, '+00:00', @@session.time_zone), '%b %d, %Y')) AS "due_date",
                   (CASE
                        WHEN T.Status = 1 THEN 'Pending'
                        WHEN T.Status = 2 THEN 'In Progress'
                        WHEN T.Status = 3 THEN 'Completed'
                   END) AS 'status',
                   CONCAT(TRIM(U.LastName), ', ', TRIM(U.FirstName), ' ', TRIM(U.MiddleName)) AS "created_by"
                   FROM tasks AS T
                   INNER JOIN users AS U
			       ON U.ID = t.CreatedBy
                   WHERE T.CreatedBy = ? AND T.ID = ?
                   ORDER BY T.ID ASC             
                   LIMIT 1`;
    return await helperMethods.queryDatabase(query, [userID, taskID]);
}

async function createTask(userID, task) {
    const query = `INSERT INTO tasks 
                   (Title, Description, DueDate, CreatedBy) 
                   VALUES (?, ?, ?, ?)`;
    await helperMethods.queryDatabase(query, [task.title, task.description, task.due_date, userID]);
}

async function updateTask(userID, taskID, task) {
    const query = `UPDATE tasks 
                   SET Title = ?, Description = ?, DueDate = ?, UpdatedBy = ?, DateTimeUpdated = NOW()
                   WHERE ID = ?`;
   await helperMethods.queryDatabase(query, [task.title, task.description, task.due_date, userID, taskID]);
}

async function deleteTask(taskID) {
    const query = `DELETE FROM tasks WHERE ID = ?`;
    return await helperMethods.queryDatabase(query, [taskID]);
}

async function getCreatedBy(taskID) {
    const query = `SELECT 
                   CreatedBy AS "created_by"
                   FROM tasks 
                   WHERE ID = ?
                   LIMIT 1 `;
    return (await helperMethods.queryDatabase(query, [taskID]))[0].created_by;
}

export default {
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask,
    getCreatedBy
}