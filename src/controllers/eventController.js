import Event from "../models/Event.js";
import { ApiResponse } from "../utils/responses.js";

const toInt = (value) => Number.parseInt(value, 10);

const applyFilters = (events, query) => {
  let result = [...events];

  if (query.location) {
    const location = String(query.location).toLowerCase();
    result = result.filter((event) => event.location.toLowerCase() === location);
  }

  if (query.capacity) {
    const capacity = toInt(query.capacity);
    if (Number.isNaN(capacity)) {
      const error = new Error("capacity must be an integer");
      error.status = 400;
      throw error;
    }
    result = result.filter((event) => event.capacity === capacity);
  }

  if (query.search) {
    const needle = String(query.search).toLowerCase();
    result = result.filter((event) => event.title.toLowerCase().includes(needle));
  }

  if (query.sort) {
    const sortValue = String(query.sort);
    const descending = sortValue.startsWith("-");
    const field = descending ? sortValue.slice(1) : sortValue;
    const allowedFields = ["id", "title", "date", "location", "capacity"];

    if (!allowedFields.includes(field)) {
      const error = new Error(`Invalid sort field: ${field}`);
      error.status = 400;
      throw error;
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === bVal) return 0;
      if (descending) return aVal < bVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  }

  return result;
};

const paginate = (events, query) => {
  if (!query.page && !query.limit) {
    return {
      items: events,
      page: null,
      limit: null,
      total: events.length,
      pages: null,
    };
  }

  const page = toInt(query.page || "1");
  const limit = toInt(query.limit || "5");

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
    const error = new Error("page and limit must be integers >= 1");
    error.status = 400;
    throw error;
  }

  const total = events.length;
  const start = (page - 1) * limit;
  const items = events.slice(start, start + limit);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export class EventController {
  static getAllEvents(req, res, next) {
    try {
      const allEvents = Event.getAll();
      const filtered = applyFilters(allEvents, req.query);
      const paginated = paginate(filtered, req.query);

      return res.json(
        ApiResponse.success(
          {
            count: paginated.items.length,
            total: paginated.total,
            page: paginated.page,
            limit: paginated.limit,
            pages: paginated.pages,
            events: paginated.items,
          },
          "Events fetched successfully"
        )
      );
    } catch (error) {
      return next(error);
    }
  }

  static getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const event = Event.getById(id);

      if (!event) {
        return res
          .status(404)
          .json(ApiResponse.error(`Event ${id} not found`, 404));
      }

      return res.json(ApiResponse.success(event, "Event fetched successfully"));
    } catch (error) {
      return next(error);
    }
  }

  static createEvent(req, res, next) {
    try {
      const { title, date, location, capacity } = req.body;

      const newEvent = Event.create({
        title,
        date,
        location,
        capacity,
      });

      return res
        .status(201)
        .json(ApiResponse.success(newEvent, "Event created successfully", 201));
    } catch (error) {
      return next(error);
    }
  }

  static updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const updatedEvent = Event.update(id, req.body);

      if (!updatedEvent) {
        return res
          .status(404)
          .json(ApiResponse.error(`Event ${id} not found`, 404));
      }

      return res.json(
        ApiResponse.success(updatedEvent, "Event updated successfully")
      );
    } catch (error) {
      return next(error);
    }
  }

  static deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      const deletedEvent = Event.delete(id);

      if (!deletedEvent) {
        return res
          .status(404)
          .json(ApiResponse.error(`Event ${id} not found`, 404));
      }

      return res.json(
        ApiResponse.success(deletedEvent, "Event deleted successfully")
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default EventController;
