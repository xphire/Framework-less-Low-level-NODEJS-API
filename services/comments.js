import { executeQuery } from "../database/executeQuery.js";

export async function createCommentService(payload) {
  try {
    if (!payload) throw new Error("no payload supplied");

    const query = `
         INSERT INTO comments (userId,postId,comment)
         VALUES(?,?,?)
        `;

    const { userId, postId, comment } = payload;

    const params = [userId, postId, comment];

    return await executeQuery(query, params);
  } catch (error) {
    console.error("error creating post", error);
    throw error;
  }
}

export async function fetchCommentService(id) {
  try {
    if (!id) throw new Error("no id supplied");

    return await executeQuery(`SELECT * FROM \`comments\` WHERE \`id\` = ?`, [
      id,
    ]);
  } catch (error) {
    console.error(`error fetching comment with id ${id}`, error);
    throw error;
  }
}

export async function updateCommentService(payload) {
  try {
    if (!payload) throw new Error("payload not provided");

    const { comment, id } = payload;

    const query = `
        UPDATE comments SET comment = ? WHERE id = ?
        `;

    const params = [comment, id];

    return await executeQuery(query, params);
  } catch (error) {
    console.error("error updating comment", error);
    throw error;
  }
}

export async function deleteCommentService(id) {
  try {
    if (!id) throw new Error("no id supplied");

    const query = `
          DELETE FROM comments WHERE id = ?
        `;

    return await executeQuery(query, [id]);
  } catch (error) {
    console.error(`error deleting user with id ${id}`, error);
    throw error;
  }
}

export async function fetchPostCommentsService(postId, skip = '0', take = '10') {
  try {
    if (!postId) throw new Error("no postId supplied");

    const query = `
        SELECT CONCAT(first_name,' ',last_name) AS 'full_name',
        comment, COUNT(*) OVER() AS total_count FROM comments
        LEFT JOIN users ON comments.userId = users.id
        WHERE comments.postId = ?
        ORDER BY comments.created_at DESC
        LIMIT ? OFFSET ?`;

    return await executeQuery(query, [postId, parseInt(take), parseInt(skip)]);
  } catch (error) {
    console.error(`error fetching comments for post with ID: ${postId}`, error);
    throw error;
  }
}
