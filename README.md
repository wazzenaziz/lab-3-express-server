# Lab 3: Express.js Server Mastery

This project implements Lab 3 backend tasks for Express.js routing, middleware, and MVC architecture.

## Project Structure

- `server.js` - Main Express server
- `src/models/Event.js` - In-memory event model
- `src/controllers/eventController.js` - Event business logic
- `src/routes/eventRoutes.js` - Event route definitions
- `src/middleware.js` - Logger, validation, timing, error middleware
- `src/utils/responses.js` - Standard API response helper
- `test-api.js` - API endpoint demo tests
- `PDF_Questions_Answers.md` - Answers for all PDF prompts

## Install

```bash
npm install
```

## Run Server

```bash
npm start
```

or with auto-reload:

```bash
npm run dev
```

## Run API Demo Tests

Tests start a temporary server automatically:

```bash
npm test
```

## Main Endpoints

- `GET /`
- `GET /health`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

## Bonus Query Support

Implemented in `GET /api/events`:

- Filtering: `?location=Sfax&capacity=30`
- Search: `?search=javascript`
- Sorting: `?sort=date` or `?sort=-capacity`
- Pagination: `?page=1&limit=5`
