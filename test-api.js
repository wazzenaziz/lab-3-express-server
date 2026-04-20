import http from "node:http";
import app from "./src/app.js";

const HOST = "127.0.0.1";
const port = Number(process.env.API_PORT) || 3100;
let testServer;

const startServer = () =>
  new Promise((resolve, reject) => {
    testServer = app.listen(port, HOST, () => {
      resolve();
    });

    testServer.on("error", reject);
  });

const stopServer = () =>
  new Promise((resolve, reject) => {
    if (!testServer) {
      resolve();
      return;
    }

    testServer.close((error) => {
      if (error) {
        if (error.code === "ERR_SERVER_NOT_RUNNING") {
          resolve();
          return;
        }
        reject(error);
        return;
      }
      resolve();
    });
  });

const assertStatus = (label, result, expectedStatus) => {
  if (result.status !== expectedStatus) {
    throw new Error(
      `${label} expected status ${expectedStatus}, got ${result.status} (${JSON.stringify(result.body)})`
    );
  }
};

const makeRequest = (method, path, data = null) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(body),
          });
        } catch {
          resolve({ status: res.statusCode, body: body || null });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });

const testAPI = async () => {
  await startServer();

  console.log("=======================================");
  console.log("TESTING EVENT MANAGER API");
  console.log("=======================================\n");

  try {
    console.log("GET /api/events");
    let result = await makeRequest("GET", "/api/events");
    assertStatus("GET /api/events", result, 200);
    console.log("Status:", result.status);
    console.log("Count:", result.body.data.count, "\n");

    console.log("POST /api/events");
    result = await makeRequest("POST", "/api/events", {
      title: "Docker Masterclass",
      date: "2026-06-01",
      location: "Sfax",
      capacity: 35,
    });
    assertStatus("POST /api/events", result, 201);
    console.log("Status:", result.status);
    console.log("Created:", result.body.data.title, "\n");

    console.log("GET /api/events/1");
    result = await makeRequest("GET", "/api/events/1");
    assertStatus("GET /api/events/1", result, 200);
    console.log("Status:", result.status);
    console.log("Event:", result.body.data.title, "\n");

    console.log("PUT /api/events/1");
    result = await makeRequest("PUT", "/api/events/1", {
      title: "Advanced JavaScript Workshop",
    });
    assertStatus("PUT /api/events/1", result, 200);
    console.log("Status:", result.status);
    console.log("Updated:", result.body.data.title, "\n");

    console.log("DELETE /api/events/2");
    result = await makeRequest("DELETE", "/api/events/2");
    assertStatus("DELETE /api/events/2", result, 200);
    console.log("Status:", result.status);
    console.log("Deleted:", result.body.data.title, "\n");

    console.log("GET /api/events (after delete)");
    result = await makeRequest("GET", "/api/events");
    assertStatus("GET /api/events (after delete)", result, 200);
    console.log("Status:", result.status);
    console.log("Remaining events:", result.body.data.count, "\n");

    console.log("POST /api/events (invalid)");
    result = await makeRequest("POST", "/api/events", {
      title: "Incomplete Event",
    });
    assertStatus("POST /api/events (invalid)", result, 400);
    console.log("Status:", result.status);
    console.log("Error:", result.body.message, "\n");

    console.log("GET /api/events/999");
    result = await makeRequest("GET", "/api/events/999");
    assertStatus("GET /api/events/999", result, 404);
    console.log("Status:", result.status);
    console.log("Message:", result.body.message, "\n");

    console.log("GET /api/events?location=Sfax&sort=-capacity&page=1&limit=2");
    result = await makeRequest(
      "GET",
      "/api/events?location=Sfax&sort=-capacity&page=1&limit=2"
    );
    assertStatus("GET /api/events with query params", result, 200);
    console.log("Status:", result.status);
    console.log("Filtered count:", result.body.data.count, "\n");

    console.log("=======================================");
    console.log("ALL TESTS COMPLETE");
    console.log("=======================================");
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  } finally {
    await stopServer();
  }
};

testAPI();
