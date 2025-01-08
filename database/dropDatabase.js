import { executeQuery } from "./executeQuery.js";

const database = process.env['DATABASE_NAME'];

const query = `
DROP DATABASE \`${database}\`;
`;

executeQuery(query, null)
  .then(() => {
    console.log(`successfully dropped database: ${database}`);
    process.exit(0)
  })
  .catch((error) => {
    console.error(`failed to drop database: ${database}`,error); 
    process.exit(1)
    });
