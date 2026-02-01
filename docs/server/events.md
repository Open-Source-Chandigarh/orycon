# Events API Documentation

This document contains backend API documentation for **Event routes**.

These APIs are handled inside:
`apps/server/src/controller/event.controller.ts`

---

## Base Route

> The exact base route depends on routing configuration.
Most likely base path:

/api/events

---

## Common Response Format

All Event endpoints return JSON in the following format.

###  Success Response
{
  "data": {},
  "message": "Success message",
  "error": null
}

###  Failure Response
{
  "data": null,
  "message": "Error message",
  "error": {}
}

---

# 1) Create Event

## Endpoint
POST /api/events/create

## Purpose
Creates a new event and stores it into the database.

## Controller Method
createEvent(req, res)

---

## Request Body

{
  "data": {
    "name": "Event Name",
    "eventStartDate": "2026-01-14T00:00:00.000Z",
    "...": "other event fields"
  }
}

### Required Fields
- data (object)
- data.name (string)
- data.eventStartDate (ISO Date string)

> Note: The controller checks uniqueness based on:
name + eventStartDate

---

## Success Response (200)

{
  "data": {
    "id": "event_id",
    "name": "Event Name",
    "eventStartDate": "2026-01-14T00:00:00.000Z"
  },
  "message": "Event created successfully",
  "error": null
}

---

## Failure Response

### Possible Failure Messages
- Event Already Exists
- Couldn't Create Event

### Example Failure Response
{
  "data": null,
  "message": "Event Already Exists",
  "error": {}
}

---

# 2) Remove Event

## Endpoint
DELETE /api/events/remove

## Purpose
Deletes an event from database using its ID.

## Controller Method
removeEvent(req, res)

---

## Request Body

{
  "id": "event_id"
}

### Required Fields
- id (string)

---

## Success Response (200)

{
  "data": {
    "id": "event_id",
    "name": "Event Name"
  },
  "message": "Event Deleted Successfully",
  "error": null
}

---

## Failure Response

### Possible Failure Messages
- No Such Event Exists
- Couldn't Delete Event

### Example Failure Response
{
  "data": null,
  "message": "No Such Event Exists",
  "error": {}
}

---

# 3) Update Event

## Endpoint
PUT /api/events/update

## Purpose
Updates event data using its ID.

## Controller Method
updateEvent(req, res)

---

## Request Body

{
  "id": "event_id",
  "data": {
    "name": "Updated Event Name",
    "eventStartDate": "2026-02-01T00:00:00.000Z",
    "...": "other updated fields"
  }
}

### Required Fields
- id (string)
- data (object)

---

## Success Response (200)

{
  "data": {
    "id": "event_id",
    "name": "Updated Event Name",
    "eventStartDate": "2026-02-01T00:00:00.000Z"
  },
  "message": "Event Updated Successfully",
  "error": null
}

---

## Failure Response

### Possible Failure Messages
- No Such Event Exists
- Couldn't Update Event

### Example Failure Response
{
  "data": null,
  "message": "No Such Event Exists",
  "error": {}
}

---

# 4) Get All Events

## Endpoint
GET /api/events/all

## Purpose
Fetches all events from the database.

## Controller Method
getAllEvents(req, res)

---

## Request Body
No request body required.

---

## Success Response (200)

### If events exist
{
  "data": [
    {
      "id": "event_id",
      "name": "Event Name",
      "eventStartDate": "2026-01-14T00:00:00.000Z"
    }
  ],
  "message": "Events found Successfully",
  "error": null
}

### If no events exist
{
  "data": [],
  "message": "No Events found",
  "error": null
}

---

## Failure Response
{
  "data": null,
  "message": "Some error message",
  "error": {}
}

---

# 5) Get Event By ID

## Endpoint
POST /api/events/id

## Purpose
Fetches a single event using its ID.

## Controller Method
getEventsById(req, res)

---

## Request Body

{
  "id": "event_id"
}

### Required Fields
- id (string)

---

## Success Response (200)

{
  "data": {
    "id": "event_id",
    "name": "Event Name",
    "eventStartDate": "2026-01-14T00:00:00.000Z"
  },
  "message": "Event found Successfully",
  "error": null
}

---

## Failure Response

### Possible Failure Messages
- Event doesn't exist

### Example Failure Response
{
  "data": null,
  "message": "Event doesn't exist",
  "error": {}
}
