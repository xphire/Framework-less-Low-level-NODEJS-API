import { baseValidator } from "./base.js";

export function createUserValidator(data) {
  const schema = {
    type: "object",
    properties: {
      email: { type: "string", minLength: 1 },
      lastName: { type: "string", minLength: 1 },
      firstName: { type: "string", minLength: 1 },
      password: { type: "string", minLength: 1 },
    },
    required: ["email", "lastName", "firstName", "password"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}

export function fetchUserValidator(data) {
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

export function updateUserValidator(data) {
  const schema = {
    type: "object",
    properties: {
      id : {type : "number"},
      email: { type: "string", minLength: 1 },
      lastName: { type: "string", minLength: 1 },
      firstName: { type: "string", minLength: 1 },
    },
    required: ["email", "lastName", "firstName","id"],
    additionalProperties: false,
  };

  return baseValidator(schema, data);
}
