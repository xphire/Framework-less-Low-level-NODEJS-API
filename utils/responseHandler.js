export function responseHandler(
  response,
  responseCode,
  error = null,
  data = null
) {
  const responseStructure = {
    code: responseCode,
    success: false,
    error,
    data,
  };

  if (responseCode < 400) {
    response.writeHead(responseCode, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        ...responseStructure,
        success: true,
      })
    );
    return;
  }

  response.writeHead(responseCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(responseStructure));
  return;
}
