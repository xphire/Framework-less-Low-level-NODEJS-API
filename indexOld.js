import http from "node:http";
import { convertToLowerCase } from "./utils/utils.js";
import { createUserController } from "./controllers/users.js";
// Create a local server to receive data from
// const server = http.createServer((req, res) => {
//     console.log('request method:  ',req.method)
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   res.end(JSON.stringify({
//     path: req.url,
//   }));
// });

startServer();

async function startServer() {
  try {
    const PORT = 8000;

    const server = http.createServer();

    server.on("request", async (request, response) => {
      const urlPath = convertToLowerCase(request.url);
      try {
        if (request.method === "GET") {
          switch (urlPath) {
            case "/health":
              response.writeHead(200, { "Content-Type": "text/plain" });
              response.end("server alive and kicking");
              break;
            default:
              response.writeHead(404, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ error: `${request.url} not found` })
              );
          }
        } else if (request.method === "POST") {
          switch (urlPath) {
            case "/user":
              let holder = [];
              let requestBody;
              request.on("data", (chunk) => {
                holder.push(chunk);
              });
              request.on("end", async () => {
                requestBody = JSON.parse(Buffer.concat(holder).toString());
                const { code, errors, data } = await createUserController(
                  requestBody
                );

                response.writeHead(code, {
                  "Content-Type": "application/json",
                });

                if (errors) {
                  response.end(JSON.stringify(errors));
                }

                if (data) {
                  response.end(JSON.stringify(data));
                }
              });
              break;

            default:
              response.writeHead(404, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ error: `${request.url} not found` })
              );
          }
        }
      } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "internal server error" }));
        throw error;
      }
    });

    server.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}
