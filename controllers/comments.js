import {
  createCommentValidator,
  fetchCommentValidator,
  updateCommentValidator,
  fetchPostCommentsValidator,
} from "../validators/comments.js";

import {
  createCommentService,
  fetchCommentService,
  updateCommentService,
  deleteCommentService,
  fetchPostCommentsService,
} from "../services/comments.js";

import { fetchUserService } from "../services/users.js";

import { fetchPostService } from "../services/posts.js";

import { bodyValidator } from "../utils/bodyValidator.js";
import { responseHandler } from "../utils/responseHandler.js";
import { bodyParser } from "../utils/bodyParser.js";
import { queryParser } from "../utils/queryParser.js";
import { responseSerializer } from "../utils/responseSerializer.js";

export async function createCommentController(request, response) {
  try {
    const payload = await bodyParser(request);

    const { valid, errors } = bodyValidator(createCommentValidator, payload);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    //check user and post validity

    const { postId, userId } = payload;

    const validPost = await fetchPostService(postId);

    if (!validPost["results"][0]) {
      return responseHandler(response, 400, "invalid post", null);
    }

    const validUser = await fetchUserService(userId);

    if (!validUser["results"][0]) {
      return responseHandler(response, 400, "invalid user", null);
    }

    const { results } = await createCommentService(payload);

    const { insertId } = results;

    const resBody = {
      id: insertId,
      ...payload,
    };

    return responseHandler(response, 201, null, resBody);
  } catch (error) {
    console.error("create comment controller error", error);
    return responseHandler(response, 500, "error creating comment");
  }
}

export async function fetchCommentController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(fetchCommentValidator, queryObject);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { id } = queryObject;

    const { results } = await fetchCommentService(id);

    const resBody = results[0];

    if (!resBody) {
      return responseHandler(response, 404, "failed to retrieve comment");
    }

    return responseHandler(response, 200, null, resBody);
  } catch (error) {
    console.error("fetch comment controller error:", error);
    return responseHandler(response, 500, "error retrieving comment");
  }
}

export async function updateCommentController(request, response) {
  try {
    const requestBody = await bodyParser(request);

    const { valid, errors } = bodyValidator(
      updateCommentValidator,
      requestBody
    );

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    await updateCommentService(requestBody);

    return responseHandler(response, 200, null, requestBody);
  } catch (error) {
    console.error("update comment controller error", error);
    return responseHandler(response, 500, "error updating comment");
  }
}

export async function deleteCommentController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(fetchCommentValidator, queryObject);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { id } = queryObject;

    await deleteCommentService(id);

    return responseHandler(response, 204);
  } catch (error) {
    console.error("delete comment controller error: ", error);
    return responseHandler(response, 500, "error deleting comment");
  }
}

export async function fetchPostCommentsController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(
      fetchPostCommentsValidator,
      queryObject
    );

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { postId, page, perPage } = queryObject;

    const take = parseInt(perPage || "10");

    const skip = take * (page ? parseInt(page) - 1 : 1);

    const { results } = await fetchPostCommentsService(postId, skip, take);

    const comments = (results && results.length > 0)  ? [...results].map((comment) =>
        responseSerializer(comment, ["total_count"])
      ) : []

    return responseHandler(response, 200, null, {
      comments,
      meta: {
        total: (results && results.length > 0) ? results[0]["total_count"] : 0,
        page: page || 1,
        perPage: perPage || 10,
      },
    });
  } catch (error) {
    console.error("fetch post comments controller error", error);
    return responseHandler(response, 500, "error fetching post comments");
  }
}
