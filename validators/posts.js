import { baseValidator } from "./base.js";

export function createPostValidator(data) {
  const schema = {
    type: "object",
    properties: {
      userId: { type: "number"},
      title: { type: "string", minLength: 1 },
      post: { type: "string", minLength: 1 }
    },
    required: ["userId", "title", "post"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}

export function fetchPostValidator(data) {
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

export function updatePostValidator(data) {
    const schema = {
      type: "object",
      properties: {
        id: { type: "number"},
        title: { type: "string", minLength: 1 },
        post: { type: "string", minLength: 1 }
      },
      required: ["id", "title", "post"],
      additionalProperties: false,
    };
  
    return baseValidator(schema, data);
}