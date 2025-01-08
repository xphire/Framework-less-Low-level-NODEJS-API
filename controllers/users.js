import {
  createUserValidator,
  fetchUserValidator,
  updateUserValidator,
} from "../validators/users.js";
import {
  createUserService,
  deleteUserService,
  fetchUserService,
  updateUserService,
} from "../services/users.js";
import { bodyValidator } from "../utils/bodyValidator.js";
import { responseHandler } from "../utils/responseHandler.js";
import { bodyParser } from "../utils/bodyParser.js";
import { responseSerializer } from "../utils/responseSerializer.js";
import { queryParser } from "../utils/queryParser.js";

export async function createUserController(request, response) {
  try {
    const payload = await bodyParser(request);

    const { valid, errors } = bodyValidator(createUserValidator, payload);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    //check if user exists

    const { email } = payload;

    const userExist = await fetchUserService(null, email);

    if (userExist["results"][0]) {
      return responseHandler(response, 409, "user already exists", null);
    }

    const { results } = await createUserService(payload);

    const { insertId } = results;

    const resBody = {
      id: insertId,
      ...responseSerializer(payload, ["password"]),
    };

    return responseHandler(response, 201, null, resBody);
  } catch (error) {
    console.error("create user controller error :", error);
    return responseHandler(response, 500, "error creating user");
  }
}

export async function fetchUserController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(fetchUserValidator, queryObject);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { id } = queryObject;

    const { results } = await fetchUserService(id);

    const resBody = results[0];

    if (!resBody) {
      return responseHandler(response, 404, "user not found");
    }

    return responseHandler(
      response,
      200,
      null,
      responseSerializer(resBody, ["password", "created_at", "updated_at"])
    );
  } catch (error) {
    console.error("error fetching user", error);
    return responseHandler(response, 500, "error fetching user");
  }
}

export async function updateUserController(request, response) {
  try {
    const requestBody = await bodyParser(request);

    const { valid, errors } = bodyValidator(updateUserValidator, requestBody);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    await updateUserService(requestBody);

    return responseHandler(response, 200, null, requestBody);
  } catch (error) {
    console.error("error updating user", error);
    return responseHandler(response, 500, "error updating user");
  }
}

export async function deleteUserController(request, response) {
  try {
    const queryObject = queryParser(request.url);

    const { valid, errors } = bodyValidator(fetchUserValidator, queryObject);

    if (!valid) {
      return responseHandler(response, 400, errors);
    }

    const { id } = queryObject;

    await deleteUserService(id);

    return responseHandler(response, 204);
  } catch (error) {
    console.error("error deleting user", error);
    return responseHandler(response, 500, "error deleting user");
  }
}
