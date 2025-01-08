import { responseHandler } from "../utils/responseHandler.js";

export async function healthCheckController(request, response) {
  try {
    return responseHandler(
      response,
      200,
      null,
      {status : 'OK!'}
    );
  } catch (error) {
    console.error("error fetching user", error);
    return responseHandler(response, 500, "error fetching user");
  }
}
