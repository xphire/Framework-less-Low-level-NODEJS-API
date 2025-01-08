import test, { suite } from "node:test";
import { startServer } from "../../app.js";
import request from "supertest";
import { assert } from "chai";

suite("suite of /health route tests", async (t) => {
  let server;

  try {
    server = await startServer();

    test("POST /health route returns 405 status code as an unallowed method", async () => {

       const {statusCode} = await request(server).post('/health');

       //Assertions
       assert.equal(statusCode,405,"Expected status code 405");
    })

    test("GET /health route returns 200 status code and valid response body", async () => {
      const { statusCode, body } = await request(server).get("/health");

      // Assertions
      assert.equal(statusCode, 200, "Expected status code 200");
      assert.containsAllKeys(body, ["code", "success", "error", "data"]);
      assert.equal(body["data"]["status"], "OK!");
    });
  } catch (error) {
    console.error("health suite test error: ", error);
    throw error;
  }
});
