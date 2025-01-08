import test,{suite} from "node:test";
import { startServer } from "../../app.js";
import request from "supertest";
import { assert } from "chai";
import { faker } from "@faker-js/faker";

faker.seed(125);

suite("suite of /comment route e2e tests", async () => {
  let server;
  try {
    server = await startServer();

    //const server = await startServer();
    const email = "xpc@gmail.com";
    const firstName = "Adekanbi";
    const lastName = "Otolorin";
    const password = "xp314680pml";
    const comment = faker.lorem.paragraphs();
    const post = faker.lorem.paragraphs();
    const title = faker.lorem.sentence(20);
    const user = await request(server).post("/user").send({
      email,
      firstName,
      lastName,
      password,
    });
    const userId = user["body"]["data"]["id"];
    const postCall = await request(server)
      .post("/post")
      .send({ userId, title, post });
    const postId = postCall["body"]["data"]["id"];

    let commentId;

    test(
      "PATCH /comment route returns 405 status code for a not allowed method",
      async () => {
        const { statusCode, body } = await request(server).patch("/comment");

        // Assertions
        assert.equal(statusCode, 405, "Expected status code 405");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);
      }
    );

    test(
      "POST /comment route returns 201 status code for successfully created comment",
      async () => {
        const { statusCode, body } = await request(server)
          .post("/comment")
          .send({
            userId,
            postId,
            comment,
          });

        const { data } = body;
        commentId = data["id"];
        //Assertions
        assert.equal(statusCode, 201, "Expected status code 201");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], commentId);
        assert.equal(data["userId"], userId);
        assert.equal(data["postId"], postId);
        assert.equal(data["comment"], comment);
      }
    );

    test(
      "GET /comment?id route returns 200 status code for successfully fetched user created above",
      async () => {
        const { statusCode, body } = await request(server).get(
          `/comment/?id=${commentId}`
        );

        const { data } = body;

        //Assertions
        assert.equal(statusCode, 200, "Expected status code 200");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], commentId);
        assert.equal(data["postId"], postId);
        assert.equal(data["userId"], userId);
      }
    );

    test(
      "PUT /comment route returns 200 status code for successfully updating comment created above",
      async () => {
        const { statusCode, body } = await request(server)
          .put("/comment")
          .send({
            comment,
            id: commentId,
          });

        const { data } = body;

        //Assertions
        assert.equal(statusCode, 200, "Expected status code 200");
        assert.containsAllKeys(body, ["code", "success", "error", "data"]);

        assert.equal(data["id"], commentId);
        assert.equal(data["comment"], comment);
      }
    );

    test(
      "DELETE /comment route returns 204 status code for successfully deleting comment created above",
      async (t) => {
        const { statusCode } = await request(server).delete(
          `/comment/?id=${commentId}`
        );

        //Assertions
        assert.equal(statusCode, 204, "Expected status code 204");
      }
    );

    test(
      "GET /comments route returns 200 status code for successfully fetching comments related to a post",async () => {

         //create 3 comments under a post

         let counter = 0;

         const run = setInterval(async () => {
              await request(server).post('/comment').send({
              userId,postId,comment
           });
           counter += 1
         },1000)


         await new Promise((resolve) => {
            setTimeout(() => {
              resolve(clearInterval(run));
           },3000)
         })


        const {statusCode,body} =  await request(server).get(`/comments/?postId=${postId}&page=1&perPage=${counter}`).send({
          userId,postId,comment
        });

        const {data} = body;
        const {meta} = data
        const {page,perPage} = meta


        //Assertions

        assert.equal(statusCode,200,'expects 200 status code')
        assert.containsAllKeys(data,['comments','meta'])
        assert.containsAllKeys(meta,['total','page','perPage'])
        assert.equal(page,1)
        assert.equal(perPage,counter)

      }
    )

  } catch (error) {
    console.log("comments test suite error: ", error);
    throw error;
  }
});
