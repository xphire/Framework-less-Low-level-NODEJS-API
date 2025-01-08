import {
  fetchUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/users.js";
import {
  fetchPostController,
  createPostController,
  updatePostController,
  deletePostController,
} from "../controllers/posts.js";
import {createCommentController,fetchCommentController,updateCommentController,deleteCommentController,fetchPostCommentsController } from "../controllers/comments.js";
import { healthCheckController } from "../controllers/health.js";
import { responseHandler } from "../utils/responseHandler.js";
import { convertToLowerCase } from "../utils/utils.js";

export const routes = {
  "/health": {
    GET: healthCheckController,
  },
  "/user": {
    GET: fetchUserController,
    POST: createUserController,
    PUT: updateUserController,
    DELETE: deleteUserController,
  },
  "/post": {
    GET: fetchPostController,
    POST: createPostController,
    PUT: updatePostController,
    DELETE: deletePostController,
  },
  "/comments" : {
    GET : fetchPostCommentsController
  },
  "/comment" : {
    GET : fetchCommentController,
    POST : createCommentController,
    PUT : updateCommentController,
    DELETE : deleteCommentController
  }
};

export const routeHandler = async (request, response) => {
  try {
    const path = request.url;

    const method = request.method;

    const urlPath = convertToLowerCase(path);

    const neededRoute = Object.keys(routes).find((route) =>
      urlPath.startsWith(route)
    );

    if (!neededRoute) {
      return responseHandler(response, 404, `${urlPath} not found`);
    }

    if (Object.hasOwn(routes[neededRoute], method)) {
      return await routes[neededRoute][method](request, response);
    }

    return responseHandler(response, 405, "method not allowed");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
