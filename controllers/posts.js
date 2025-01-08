import {
  createPostService,
  fetchPostService,
  updatePostService,
  deletePostService,
} from "../services/posts.js";

import { fetchUserService } from "../services/users.js";

import {
  createPostValidator,
  fetchPostValidator,
  updatePostValidator,
} from "../validators/posts.js";

import { bodyValidator } from "../utils/bodyValidator.js";
import { responseHandler } from "../utils/responseHandler.js";
import { bodyParser } from "../utils/bodyParser.js";
import { queryParser } from "../utils/queryParser.js";

export async function createPostController(request, response) {
  try {
    const payload = await bodyParser(request);

    const { valid, errors } = bodyValidator(createPostValidator, payload);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    //check if user is valid

    const { userId } = payload;

    const validUser = await fetchUserService(userId);

    if (!validUser['results'][0]) {
      return responseHandler(response, 400, "invalid user", null);
    }

    const { results } = await createPostService(payload);

    const { insertId } = results;

    const resBody = {
      id: insertId,
      ...payload,
    };

    return responseHandler(response, 201, null, resBody);
  } catch (error) {
    console.error("create post controller error: ", error);
    return responseHandler(response, 500, "error creating post");
  }
}

export async function fetchPostController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(fetchPostValidator, queryObject);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { id } = queryObject;

    const { results } = await fetchPostService(id);

    const resBody = results[0];

    if (!resBody) {
      return responseHandler(response, 404, "failed to retrieve post");
    }

    return responseHandler(response, 200, null, resBody);
  } catch (error) {
    console.error("fetch post controller error: ", error);
    return responseHandler(response, 500, "error retrieving post");
  }
}

export async function updatePostController(request, response) {
  try {
    const requestBody = await bodyParser(request);

    const { valid, errors } = bodyValidator(updatePostValidator, requestBody);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    await updatePostService(requestBody);

    return responseHandler(response, 200, null, requestBody);
  } catch (error) {
    console.error("update post controller error: ", error);
    return responseHandler(response, 500, "error updating post");
  }
}

export async function deletePostController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(fetchPostValidator, queryObject);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { id } = queryObject;

    await deletePostService(id);

    return responseHandler(response, 204);
  } catch (error) {
    console.error("delete post controller error: ", error);
    return responseHandler(response, 500, "error deleting post");
  }
}
