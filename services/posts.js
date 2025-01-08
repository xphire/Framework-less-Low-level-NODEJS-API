import { executeQuery } from "../database/executeQuery.js";

export async function createPostService(payload) {
  try {
    if (!payload) throw new Error("no payload supplied");

    const query = `
         INSERT INTO posts (userId,title,post)
         VALUES(?,?,?)
        `;

    const { userId, title, post } = payload;

    const params = [userId, title, post];

    return await executeQuery(query, params);
  } catch (error) {
    console.error("error creating post", error);
    throw error;
  }
}

export async function fetchPostService(id) {
  try {
    if (!id) throw new Error("no id supplied");

    return await executeQuery(`SELECT * FROM \`posts\` WHERE \`id\` = ?`, [id]);
  } catch (error) {
    console.error(`error fetching post with id ${id}`,error);
    throw error;
  }
}

export async function updatePostService(payload) {
  try {
    if (!payload) throw new Error("payload not provided");

    const { title, post, id } = payload;

    const query = `
        UPDATE posts SET title = ? , post = ? WHERE id = ?
        `;

    const params = [title, post,id];

    return await executeQuery(query, params);
  } catch (error) {
    console.error("error updating post", error);
    throw error;
  }
}

export async function deletePostService(id) {
  try {
    if (!id) throw new Error("no id supplied");

    const query = `
          DELETE FROM posts WHERE id = ?
        `;

    return await executeQuery(query, [id]);
  } catch (error) {
    console.error(`error deleting user with id ${id}`,error);
    throw error;
  }
}
