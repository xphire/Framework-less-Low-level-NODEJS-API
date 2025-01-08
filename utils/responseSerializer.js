export function responseSerializer(payload, property = []) {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be a non-null object");
  }

  if (!Array.isArray(property)){
    throw new Error("property must be an array of strings")
  }

  const toCheck = {...payload}

  property.forEach((prop) => {
    if (!Object.hasOwn(toCheck, prop)) {
      throw new Error(`Invalid property: ${prop}`);
    }

    delete toCheck[prop]
  });

  return toCheck

  const { [property]: _, ...rest } = payload; // Create a new object excluding the property
  return rest;
}
