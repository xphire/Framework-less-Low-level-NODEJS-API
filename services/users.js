import { executeQuery } from "../database/executeQuery.js";
import bcrypt from "bcrypt";

export async function createUserService(payload) {
  try {
    const { email, firstName, lastName, password } = payload;

    const lowerCaseEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
         INSERT INTO users (email,last_name,first_name,password)
         VALUES(?,?,?,?)
    `;

    const params = [lowerCaseEmail, lastName, firstName, hashedPassword];

    return await executeQuery(query, params);
  } catch (error) {
    console.error("create user service error", error);
    throw error;
  }
}

export async function fetchUserService(id, email) {
  try {
    if (!id && !email) throw new Error("fetch property not supplied");

    if (id) {
      return await executeQuery(`SELECT * FROM \`users\` WHERE \`id\` = ?`, [
        id,
      ]);
    }

    return await executeQuery(`SELECT * FROM \`users\` WHERE \`email\` = ?`, [
      email.toLowerCase(),
    ]);
  } catch (error) {
    console.error("error fetching user", error);
    throw error;
  }
}

export async function updateUserService(payload) {
  try {
    const { email, firstName, lastName, id } = payload;

    const query = `
      UPDATE users SET email = ? , first_name = ? , last_name = ? WHERE id = ?
      `;

    return await executeQuery(query, [email, firstName, lastName, id]);
  } catch (error) {
    console.error("error updating user", error);
    throw error;
  }
}

export async function deleteUserService(id) {
  try {
    if (!id) throw new Error("user id not supplied");

    const query = `
    DELETE FROM users WHERE id = ?
    `;

    return await executeQuery(query, [id]);
  } catch (error) {
    console.error("error fetching user", error);
    throw error;
  }
}
