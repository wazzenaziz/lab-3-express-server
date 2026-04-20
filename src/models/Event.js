let events = [
  {
    id: 1,
    title: "JavaScript Workshop",
    date: "2026-02-15",
    location: "Sfax",
    capacity: 30,
  },
  {
    id: 2,
    title: "React Conference",
    date: "2026-03-20",
    location: "Tunis",
    capacity: 100,
  },
];

let nextId = 3;

export class Event {
  static getAll() {
    return [...events];
  }

  static getById(id) {
    return events.find((event) => event.id === Number.parseInt(id, 10));
  }

  static create(data) {
    const newEvent = {
      id: nextId++,
      ...data,
      createdAt: new Date().toISOString(),
    };

    events.push(newEvent);
    return newEvent;
  }

  static update(id, data) {
    const event = this.getById(id);
    if (!event) return null;

    Object.assign(event, data);
    event.updatedAt = new Date().toISOString();
    return event;
  }

  static delete(id) {
    const index = events.findIndex((event) => event.id === Number.parseInt(id, 10));
    if (index === -1) return null;

    return events.splice(index, 1)[0];
  }
}

export default Event;
