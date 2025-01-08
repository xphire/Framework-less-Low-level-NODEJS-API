import test,{suite} from "node:test";
import { startServer } from "../../app.js";
import request from "supertest";
import { assert } from "chai";

suite("suite of /user route e2e tests", async (t) => {
  let server;

  try {

    server = await startServer();

    const email = "xpc@gmail.com";
    const firstName = "Adekanbi";
    const lastName = "Otolorin";
    const password = "xp314680pml";

    let userId;

    test(
      "PATCH /user route returns 405 status code for a not allowed method",
      async () => {
        const { statusCode, body } = await request(server).patch("/user");

        // Assertions
        assert.equal(statusCode, 405, "Expected status code 405");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);
      }
    );

    test(
      "POST /user route returns 201 status code for successfully created user",
      async () => {
        const { statusCode, body } = await request(server)
          .post("/user")
          .send({ email, firstName, lastName, password });

        const { data } = body;
        userId = data["id"];
        //Assertions
        assert.equal(statusCode, 201, "Expected status code 201");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], userId);
        assert.equal(data["email"], email);
        assert.equal(data["firstName"], firstName);
        assert.equal(data["lastName"], lastName);

        assert.notInclude(data, ["password"]);
      }
    );

    test(
      "GET /user?id route returns 200 status code for successfully fetched user created above",
      async () => {
        const { statusCode, body } = await request(server).get(
          `/user?id=${userId}`
        );

        const { data } = body;

        //Assertions
        assert.equal(statusCode, 200, "Expected status code 200");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["email"], email);
        assert.equal(data["first_name"], firstName);
        assert.equal(data["last_name"], lastName);

        assert.notInclude(data, ["password"]);
      }
    );

    test(
      "PUT /user route returns 200 status code for successfully updating user created above",
      async () => {
        const newFirstName = "Okosun";
        const newLastName = "Jagaban";
        const newEmail = "esquire224@rocketmail.com";

        const { statusCode, body } = await request(server).put("/user").send({
          id: userId,
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
        });

        const { data } = body;

        //Assertions
        assert.equal(statusCode, 200, "Expected status code 200");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], userId);
        assert.equal(data["email"], newEmail);
        assert.equal(data["firstName"], newFirstName);
        assert.equal(data["lastName"], newLastName);

        assert.notInclude(data, ["password"]);
      }
    );

    test(
      "DELETE /user route returns 204 status code for successfully deleting user created above",
      async () => {
        const { statusCode } = await request(server).delete(
          `/user?id=${userId}`
        );

        //Assertions
        assert.equal(statusCode, 204, "Expected status code 204");
      }
    );
  } catch (error) {
    console.log("users test suite error: ", error);
    throw error;
  }
});
