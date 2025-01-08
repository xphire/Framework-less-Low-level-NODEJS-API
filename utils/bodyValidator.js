export function bodyValidator(validatorFunction, payload) {
  const { valid, errors } = validatorFunction(payload);

  const result = {
    valid,
    errors,
  };

  if (valid) {
    return {
      ...result,
      errors: null,
    };
  }

  return result;
}
