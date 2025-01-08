import { startServer } from "./app.js";


const PORT = process.env["PORT"] || 8000;

startServer()
  .then((server) => {
    try {
      server.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
      });

      // Graceful shutdown
      const shutdown = () => {
        console.log("Shutting down server...");
        server.close((err) => {
          if (err) {
            console.error("Error during server shutdown:", err);
            process.exit(1);
          }
          console.log("Server successfully closed.");
          process.exit(0);
        });
      };

      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    } catch (error) {
      console.error("Error starting server:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Error initializing server:", error);
    process.exit(1);
  });