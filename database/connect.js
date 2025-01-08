import * as mysql from "mysql";
import "dotenv/config";

const pool = mysql.createPool({
  host: "localhost",
  database : process.env["DATABASE_NAME"],
  user: process.env["DATABASE_USER"],
  password: process.env["DATABASE_PASSWORD"],
  connectionLimit: 10, // Limit the number of connections in the pool
  multipleStatements : true
});

//multiple statements as false by default to combat SQL injection


export function connectToDB() {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        console.error("Database connection failed", error);
        reject(error);
      } else {
        console.log("Database connection successful");
        resolve(connection);
      }
    });
  });
}
