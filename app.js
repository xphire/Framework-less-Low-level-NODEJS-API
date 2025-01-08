import http from "node:http";
import { routeHandler } from "./router/router.js";
import { responseHandler } from "./utils/responseHandler.js";


export async function startServer() {
  return new Promise((resolve, reject) => {
    try {
      const server = http.createServer();
      server.on("request", async (request, response) => {
        try {
          return await routeHandler(request, response);
        } catch (error) {
          responseHandler(response, 500, "internal server error");
          throw error;
        }
      });
      resolve(server);
    } catch (error) {
      reject(error);
    }
  });
}
