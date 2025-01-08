import * as mysql from 'mysql';

const query = `CREATE DATABASE IF NOT EXISTS \`${process.env['DATABASE_NAME']}\`;`;

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env['DATABASE_USER'],
    password: process.env['DATABASE_PASSWORD'],
});
    

connection.query(query, (error, results) => {
        if (error) {
            console.error('Error creating database:', error);
            process.exit(1)
        } else {
            console.log('Database successfully created or already exists.');
        }

        // Close the connection after the query is executed
        connection.end();
        process.exit(0)
});




