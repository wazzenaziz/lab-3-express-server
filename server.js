import express from "express";
import eventRoutes from "./src/routes/eventRoutes.js";
import {
  logger,
  validateEventInput,
  measureTime,
  errorHandler,
} from "./src/middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(logger);
app.use(measureTime);

app.get("/", (req, res) => {
  res.json({
    message: "Event Manager API (MVC Structure)",
    version: "1.0.0",
    endpoints: {
      getAllEvents: "GET /api/events",
      getEvent: "GET /api/events/:id",
      createEvent: "POST /api/events",
      updateEvent: "PUT /api/events/:id",
      deleteEvent: "DELETE /api/events/:id",
      health: "GET /health",
    },
  });
});

const validateEvent = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    return validateEventInput(req, res, next);
  }

  return next();
};

app.use("/api/events", validateEvent);
app.use("/api/events", eventRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Not found: ${req.method} ${req.path}`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Event Manager API started on http://localhost:${PORT}`);
});
