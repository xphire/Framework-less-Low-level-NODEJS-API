import { executeQuery } from "./executeQuery.js";

const query = `
USE DATABASE \`${process.env['DATABASE_NAME']}\`;
ALTER TABLE users 
  MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  MODIFY email VARCHAR(100) NOT NULL UNIQUE,
  MODIFY last_name VARCHAR(100) NOT NULL,MODIFY first_name VARCHAR(100) NOT NULL;
`;

// executeQuery(query, null)
// .then((results, fields) => {})
// .catch((error) => console.error(error));
