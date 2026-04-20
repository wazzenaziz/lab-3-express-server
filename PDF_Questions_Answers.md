# Lab 3 PDF Questions and Answers

This file answers explicit prompts and checkpoint questions from `LAB_3_EXPRESS.pdf` and maps each task to implemented files.

## Pre-Lab Checklist

Question: What should be ready before starting Lab 3?

Answer:
- Node.js and npm installed.
- Previous labs completed (async programming and modules).
- Basic JavaScript, async/await, and module usage understood.
- Code editor and terminal ready.

## Task 1 - First Express Server

Question: What is Express.js?

Answer:
- Express is a Node.js web framework for building servers and APIs with routing, middleware, and error handling.

Question: What do these Express basics mean?
- `app.listen(PORT)`
- `app.get(path, handler)`
- `req`
- `res`
- `res.json()`
- `res.send()`

Answer:
- `app.listen(PORT)`: starts the server on a port.
- `app.get(path, handler)`: handles HTTP GET for a path.
- `req`: incoming request data (params, query, body, headers).
- `res`: outgoing response object.
- `res.json()`: sends JSON response.
- `res.send()`: sends text/HTML/raw response.

Checkpoint 1 answers:
- `npm install` completed successfully.
- Server starts correctly.
- Routes work: `/`, `/health`, and `/api/events` endpoints are accessible once server is running.
- `req` and `res` are used in all route handlers.

## Task 2 - Routing and Parameters

Question: What is a route parameter like `:id`?

Answer:
- A dynamic URL segment captured in `req.params`, used to identify resources (for example, `GET /api/events/1`).

Checkpoint 2 answers:
- CRUD routes exist for events.
- `GET /api/events` returns event list.
- `GET /api/events/:id` returns a single event or 404 if missing.
- `POST /api/events` creates an event with `201`.
- Route parameters are handled with `req.params.id`.

## Task 3 - Middleware

Question: What is middleware?

Answer:
- Middleware is logic that runs during request processing before final route response.
- It can parse input, log requests, validate data, measure timing, and handle errors.

Checkpoint 3 answers:
- Logger middleware logs method/path and body.
- Validation middleware checks request payload for POST/PUT.
- Timing middleware reports response time.
- Errors are returned in consistent JSON format.
- Middleware order is configured globally before routes.

## Task 4 - MVC Structure

Question: What is MVC?

Answer:
- Model: data operations.
- Controller: business logic and request handling.
- View/Response: what is returned to clients (JSON API responses in this lab).

Checkpoint 4 answers:
- `models`, `controllers`, and `routes` folders are created.
- Event model encapsulates data operations.
- Event controller encapsulates business logic.
- Event routes connect endpoints to controller methods.
- Server runs with MVC routing and middleware.

## Task 5 - Complete Working API

Question: Why add a response helper?

Answer:
- To standardize success/error payloads and timestamps, keeping API responses consistent.

Question: How is the API tested?

Answer:
- `test-api.js` sends HTTP requests for CRUD operations, validation errors, and 404 checks.

Checkpoint 5 answers:
- All CRUD operations execute successfully.
- Validation and error handling are active.
- MVC structure is in place.
- Middleware chain runs on requests.
- Demo test script covers core endpoints.

## Bonus Challenges

Question: Were bonus features implemented?

Answer:
- Yes, bonus query features are implemented in `GET /api/events`:
  - Filtering (`location`, `capacity`)
  - Sorting (`sort`, including descending with `-`)
  - Pagination (`page`, `limit`)
  - Search (`search` in title)

## Deliverables Coverage Map

- `server.js` -> main Express server and route mounting
- `src/models/Event.js` -> event model
- `src/controllers/eventController.js` -> CRUD business logic + query handling
- `src/routes/eventRoutes.js` -> route definitions
- `src/middleware.js` -> logger, validation, timing, error handler
- `test-api.js` -> API demo tests
- `package.json` -> dependencies and scripts
- `README.md` -> setup and run instructions
- `src/utils/responses.js` -> standardized response helper from Task 5
