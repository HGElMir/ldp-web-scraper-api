import app from "./api/index.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.warn("Server Listening on PORT:", PORT);
});

server.timeout = 60 * 1000;
