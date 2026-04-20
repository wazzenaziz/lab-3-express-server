import http from "node:http";

const PORT = Number(process.env.API_PORT) || 3000;

const makeRequest = (method, path, data = null) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
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
  console.log("=======================================");
  console.log("TESTING EVENT MANAGER API");
  console.log("=======================================\n");

  try {
    console.log("GET /api/events");
    let result = await makeRequest("GET", "/api/events");
    console.log("Status:", result.status);
    console.log("Count:", result.body.data.count, "\n");

    console.log("POST /api/events");
    result = await makeRequest("POST", "/api/events", {
      title: "Docker Masterclass",
      date: "2026-06-01",
      location: "Sfax",
      capacity: 35,
    });
    console.log("Status:", result.status);
    console.log("Created:", result.body.data.title, "\n");

    console.log("GET /api/events/1");
    result = await makeRequest("GET", "/api/events/1");
    console.log("Status:", result.status);
    console.log("Event:", result.body.data.title, "\n");

    console.log("PUT /api/events/1");
    result = await makeRequest("PUT", "/api/events/1", {
      title: "Advanced JavaScript Workshop",
    });
    console.log("Status:", result.status);
    console.log("Updated:", result.body.data.title, "\n");

    console.log("DELETE /api/events/2");
    result = await makeRequest("DELETE", "/api/events/2");
    console.log("Status:", result.status);
    console.log("Deleted:", result.body.data.title, "\n");

    console.log("GET /api/events (after delete)");
    result = await makeRequest("GET", "/api/events");
    console.log("Status:", result.status);
    console.log("Remaining events:", result.body.data.count, "\n");

    console.log("POST /api/events (invalid)");
    result = await makeRequest("POST", "/api/events", {
      title: "Incomplete Event",
    });
    console.log("Status:", result.status);
    console.log("Error:", result.body.message, "\n");

    console.log("GET /api/events/999");
    result = await makeRequest("GET", "/api/events/999");
    console.log("Status:", result.status);
    console.log("Message:", result.body.message, "\n");

    console.log("GET /api/events?location=Sfax&sort=-capacity&page=1&limit=2");
    result = await makeRequest(
      "GET",
      "/api/events?location=Sfax&sort=-capacity&page=1&limit=2"
    );
    console.log("Status:", result.status);
    console.log("Filtered count:", result.body.data.count, "\n");

    console.log("=======================================");
    console.log("ALL TESTS COMPLETE");
    console.log("=======================================");
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
};

console.log("Waiting for server...\n");
setTimeout(testAPI, 1000);
