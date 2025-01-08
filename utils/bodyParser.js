export function bodyParser(request) {
  return new Promise((resolve, reject) => {
    try {
      let holder = [];
      request.on("data", (chunk) => holder.push(chunk));
      request.on("end", () => {
        try {
          const body = JSON.parse(Buffer.concat(holder).toString());
          resolve(body);
        } catch (err) {
          reject(new Error(err));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
