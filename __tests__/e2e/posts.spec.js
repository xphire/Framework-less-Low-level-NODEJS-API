import test, {suite} from "node:test";
import { startServer } from "../../app.js";
import request from "supertest";
import { assert } from "chai";
import { faker } from "@faker-js/faker";

faker.seed(149);

suite("suite of /post routes e2e tests", async (t) => {
  let server;

  try {
    server = await startServer();

    let userId;
    let postId;

    const email = faker.internet.email();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password();
    const title = faker.lorem.sentence(10);
    const post = faker.lorem.paragraphs(5);

    test(
      "PATCH /post route returns 405 status code for a not allowed method",
      async () => {
        const { statusCode, body } = await request(server).patch("/post");

        // Assertions
        assert.equal(statusCode, 405, "Expected status code 405");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);
      }
    );

    test(
      "POST /post route returns 201 for successfully creating a post",
      async () => {
        //recreate user to use for testing the create post route : the id 2 is used because the first user created is already deleted using the delete test above

        const user = await request(server)
          .post("/user")
          .send({ email, firstName, lastName, password })
          ;

        userId = user["body"]["data"]["id"];

        const { statusCode, body } = await request(server).post("/post").send({
          userId,
          title,
          post,
        });

        const { data } = body;
        postId = data["id"];

        //Assertions
        assert.equal(statusCode, 201, "Expected status code 201");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], postId);
        assert.equal(data["userId"], userId);
        assert.equal(data["title"], title);
        assert.equal(data["post"], post);
      }
    );

    test(
      "GET /POST?id route returns 200 status code for successfully fetched post created above",
      async () => {
        const { statusCode, body } = await request(server).get(
          `/post?id=${postId}`
        );

        const { data } = body;

        //Assertions
        assert.equal(statusCode, 200, "Expected status code 200");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["title"], title);
        assert.equal(data["post"], post);
        assert.equal(data["userId"], userId);
      }
    );

    test(
      "PUT /post route returns 200 status code for successfully updating post created above",
      async () => {
        const { statusCode, body } = await request(server).put("/post").send({
          id: postId,
          title,
          post,
        });

        const { data } = body;

        //Assertions
        assert.equal(statusCode, 200, "Expected status code 200");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], postId);
        assert.equal(data["title"], title);
        assert.equal(data["post"], post);
      }
    );

    test(
      "DELETE /post route returns 204 status code for successfully deleting post created above",
      async () => {
        const { statusCode } = await request(server).delete(
          `/post?id=${postId}`
        );

        //Assertions
        assert.equal(statusCode, 204, "Expected status code 204");
      }
    );
  } catch (error) {
    console.error("posts test suite error: ", error);
    throw error;
  }
});
