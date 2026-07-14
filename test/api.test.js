import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import app from "../api/index.js";

let baseUrl;
let server;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test("exports an Express request handler", () => {
  assert.equal(typeof app, "function");
});

test("serves the root endpoint", async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "Hello world!");
});

test("serves the status endpoint", async () => {
  const response = await fetch(`${baseUrl}/status`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 200,
    version: "1.0",
    operational: true,
  });
});
