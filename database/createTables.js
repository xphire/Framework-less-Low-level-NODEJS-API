import { executeQuery } from "./executeQuery.js";

const database = process.env['DATABASE_NAME'];

const createTablesQuery = `
USE \`${database}\`;
CREATE TABLE IF NOT EXISTS users(
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL UNIQUE,
  last_name VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS posts(
   id INT NOT NULL AUTO_INCREMENT,
   userId INT NOT NULL,
   title VARCHAR(255) NOT NULL,
   post LONGTEXT NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

   PRIMARY KEY (id),
   CONSTRAINT FK_PostsUserId FOREIGN KEY (userId) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS comments(
   id INT NOT NULL AUTO_INCREMENT,
   userId INT NOT NULL,
   postId INT NOT NULL,
   comment TEXT NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

   PRIMARY KEY (id),
   CONSTRAINT FK_CommentsUserId FOREIGN KEY (userId) REFERENCES users(id),
   CONSTRAINT FK_CommentsPostId FOREIGN KEY (postId) REFERENCES posts(id)
);


`;

executeQuery(createTablesQuery, null)
  .then((results,fields) => {
    console.log("Tables exist or successfully created");
    process.exit(0)
  })
  .catch((error) => {console.error("failed to create tables",error);process.exit(1)});
