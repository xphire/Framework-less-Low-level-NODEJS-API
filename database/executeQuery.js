import { connectToDB } from "./connect.js";

export async function executeQuery(query, params) {
  let connection;
  try {
    connection = await connectToDB();

    return new Promise((resolve, reject) => {
      connection.query(query, params, (error, results, fields) => {
        if (error) {
          console.error("query execution failed");
          reject(error);
        } else {
          resolve({ results, fields });
        }
      });
    });
  } catch (error) {
    console.log("error executing query", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}
