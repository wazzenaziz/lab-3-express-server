export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  next();
};

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const validateEventInput = (req, res, next) => {
  const { title, date, location, capacity } = req.body || {};

  if (req.method === "POST") {
    if (!title || !date || !location || capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["title", "date", "location", "capacity"],
      });
    }
  }

  if (req.method === "PUT") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }
  }

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "Title must be a string",
    });
  }

  if (date !== undefined && !isValidDate(date)) {
    return res.status(400).json({
      success: false,
      message: "Date must be a valid date string",
    });
  }

  if (location !== undefined && typeof location !== "string") {
    return res.status(400).json({
      success: false,
      message: "Location must be a string",
    });
  }

  if (
    capacity !== undefined &&
    (!Number.isInteger(capacity) || capacity < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "Capacity must be an integer >= 1",
    });
  }

  next();
};

export const measureTime = (req, res, next) => {
  const start = Date.now();
  const originalJson = res.json.bind(res);

  res.json = (data) => {
    const elapsed = Date.now() - start;
    console.log(`Response time: ${elapsed}ms`);
    return originalJson(data);
  };

  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
};
