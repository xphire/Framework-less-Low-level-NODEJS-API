import { baseValidator } from "./base.js";

export function createCommentValidator(data) {
  const schema = {
    type: "object",
    properties: {
      userId: { type: "number" },
      postId: { type: "number" },
      comment: { type: "string", minLength: 1 },
    },
    required: ["userId", "postId", "comment"],
    additionalProperties: false,
  };
  return baseValidator(schema, data);
}

export function fetchCommentValidator(data) {
  const schema = {
    type: "object",
    properties: {
      id: { type: "number"},
    },
    required: ["id"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}

export function updateCommentValidator(data) {
  const schema = {
    type: "object",
    properties: {
      id: { type: "number" },
      comment: { type: "string", minLength: 1 },
    },
    required: ["id", "comment"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}

export function fetchPostCommentsValidator(data) {
  const schema = {
    type: "object",
    properties: {
      postId: { type: "number" },
      page : {type : "number"},
      perPage : {type : "number"}
    },
    required: ["postId"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}

export function fetchUserCommentsValidator(data) {
  const schema = {
    type: "object",
    properties: {
      userId: { type: "number" },
    },
    required: ["userId"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}
