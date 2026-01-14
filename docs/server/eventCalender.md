# Event Calendar API Documentation

This document contains backend API documentation for **Event Calendar routes**.

These APIs are handled inside:
apps/server/src/controller/eventCalender.controller.ts

---

## Base Route

The exact base route depends on routing configuration.
Most likely base path:

/api/event-calendar

---

## Common Response Format

This controller returns responses in two styles.

###  Success Response (create/update/get)
Returns direct JSON object:

{
  "id": "calendar_event_id",
  "title": "Meeting",
  "description": "Some notes",
  "eventDate": "2026-01-20T00:00:00.000Z",
  "marked": true,
  "eventType": "meeting",
  "event": "Meeting"
}

###  Failure Response
Errors are usually returned like:

{
  "error": "Error message"
}

---

# 1) Add New Event To Calendar

## Endpoint
POST /api/event-calendar

## Purpose
Creates a new calendar event and stores it into the database.

## Controller Method
addNewEventToCalendar(req, res)

---

## Request Body

{
  "title": "Meeting",
  "description": "Project discussion",
  "eventDate": "2026-01-20T00:00:00.000Z",
  "marked": true,
  "eventType": "meeting"
}

### Required Fields
- title (string)
- eventDate (ISO date string)
- eventType (string)

Optional Fields
- description (string)
- marked (boolean)

---

## Success Response (201)

{
  "id": "calendar_event_id",
  "title": "Meeting",
  "description": "Project discussion",
  "eventDate": "2026-01-20T00:00:00.000Z",
  "marked": true,
  "eventType": "meeting",
  "event": "Meeting"
}

---

## Failure Responses

### 400 Bad Request
When required fields are missing:

{
  "error": "title, eventDate, and eventType are required"
}

### 409 Conflict
When event with same title already exists on same date:

{
  "error": "Event with this title already exists on the same date"
}

### 500 Internal Server Error
Generic failure:

{
  "error": "Failed to add event"
}

---

# 2) Get Events Based on Month

## Endpoint
GET /api/event-calendar?year=<year>&month=<month>

Example:
GET /api/event-calendar?year=2026&month=1

## Purpose
Fetches calendar events filtered by month and year.

## Controller Method
getEventBasedOnMonth(req, res)

---

## Query Parameters

Required:
- year (number)
- month (number, 1-12)

---

## Success Response (200)

Returns an array of events sorted by date (ascending):

[
  {
    "id": "calendar_event_id",
    "title": "Meeting",
    "description": "Project discussion",
    "eventDate": "2026-01-20T00:00:00.000Z",
    "marked": true,
    "eventType": "meeting",
    "event": "Meeting"
  }
]

---

## Failure Responses

### 400 Bad Request
If year or month is missing:

{
  "error": "year and month query parameters are required"
}

### 500 Internal Server Error
If fetching fails:

{
  "error": "Failed to fetch events"
}

---

# 3) Update Event in Calendar

## Endpoint
PUT /api/event-calendar/:eventId

Example:
PUT /api/event-calendar/abc123

## Purpose
Updates an existing calendar event by ID.

## Controller Method
updateEventToCalendar(req, res)

---

## Path Params

Required:
- eventId (string)

---

## Request Body

Any of the following fields can be updated:

{
  "title": "Updated Title",
  "description": "Updated Description",
  "eventDate": "2026-01-25T00:00:00.000Z",
  "marked": false,
  "eventType": "holiday"
}

> At least one field must be provided.

---

## Success Response (200)

Returns the updated event:

{
  "id": "calendar_event_id",
  "title": "Updated Title",
  "description": "Updated Description",
  "eventDate": "2026-01-25T00:00:00.000Z",
  "marked": false,
  "eventType": "holiday",
  "event": "Updated Title"
}

---

## Failure Responses

### 400 Bad Request
If no fields provided:

{
  "error": "No fields provided to update"
}

### 404 Not Found
If event not found (P2025):

{
  "error": "Event not found"
}

### 500 Internal Server Error
If update fails:

{
  "error": "Failed to update event"
}

---

# 4) Delete Event From Calendar

## Endpoint
DELETE /api/event-calendar/:eventId

Example:
DELETE /api/event-calendar/abc123

## Purpose
Deletes an existing calendar event by ID.

## Controller Method
deleteEventFromCalendar(req, res)

---

## Path Params

Required:
- eventId (string)

---

## Success Response (204)

No response body (empty).

---

## Failure Responses

### 404 Not Found
If event does not exist:

{
  "error": "Event not found"
}

### 500 Internal Server Error
If delete fails:

{
  "error": "Failed to delete event"
}
