# Event Documentation API Documentation

This document contains backend API documentation for **Event Documentation routes**.

These APIs are handled inside:
apps/server/src/controller/eventDoc.controller.ts

---

## Base Route

The exact base route depends on routing configuration.
Most likely base path:

/api/event-docs

---

## Common Response Format

Most endpoints return JSON in the following format:

###  Success Response
{
  "message": "Success message",
  "data": {},
  "error": null
}

###  Failure Response
{
  "message": "Error message"
}

Some endpoints return:

{
  "message": "Error message",
  "data": null,
  "error": null
}

---

# 1) Create Event Documentation

## Endpoint
POST /api/event-docs

## Purpose
Creates a new documentation entry for a specific event.

## Controller Method
createEventDocumentation(req, res)

---

## Request Body

{
  "name": "doc_name",
  "title": "Doc Title",
  "content": "Documentation content here",
  "eventId": "event_id"
}

### Required Fields
- name (string)
- title (string)
- content (string)
- eventId (string)

---

## Success Response (201)

{
  "message": "event created successfully",
  "data": {
    "id": "doc_id",
    "name": "doc_name",
    "title": "Doc Title",
    "content": "Documentation content here",
    "eventId": "event_id"
  },
  "error": null
}

---

## Failure Responses

### 400 Bad Request
If required fields are missing:

{
  "message": "Missing required fields"
}

### 409 Conflict
If EventDocumentation with same name already exists for that event:

{
  "message": "EventDocumentation with this name already exists"
}

### 500 Internal Server Error
If creation fails:

{
  "message": "error while creating event docs "
}

---

# 2) Get All Event Documentations (for an Event)

## Endpoint
GET /api/event-docs/:id

Example:
GET /api/event-docs/event_id

## Purpose
Fetches all documentation entries for a given event ID.

## Controller Method
getAllEventDocumentation(req, res)

---

## Path Params

Required:
- id (string)  -> Event ID

---

## Success Response (200)

{
  "message": "fetch successfull",
  "data": [
    {
      "id": "doc_id",
      "name": "doc_name",
      "title": "Doc Title",
      "content": "Documentation content here",
      "eventId": "event_id",
      "event": {
        "id": "event_id",
        "name": "Event Name"
      }
    }
  ],
  "error": null
}

> Docs are returned ordered by createdAt in descending order.

---

## Failure Responses

### 404 Not Found
If event does not exist:

{
  "message": "Event does not exists"
}

### 500 Internal Server Error
If fetch fails:

{
  "message": "Internal server error"
}

---

# 3) Get Event Documentation By Documentation ID

## Endpoint
GET /api/event-docs/doc/:id

Example:
GET /api/event-docs/doc/doc_id

## Purpose
Fetch a single documentation record by its documentation ID.

## Controller Method
getEventDocumentationById(req, res)

---

## Path Params

Required:
- id (string)  -> Documentation ID

---

## Success Response (200)

{
  "data": {
    "id": "doc_id",
    "name": "doc_name",
    "title": "Doc Title",
    "content": "Documentation content here",
    "eventId": "event_id",
    "event": {
      "id": "event_id",
      "name": "Event Name"
    }
  },
  "message": "EventDocumentation fetched successfully",
  "error": null
}

---

## Failure Responses

### 404 Not Found
If documentation not found:

{
  "message": "Not found"
}

### 500 Internal Server Error
If fetch fails:

{
  "message": "Internal server error"
}

---

# 4) Update Event Documentation

## Endpoint
PUT /api/event-docs/:id

Example:
PUT /api/event-docs/doc_id

## Purpose
Updates an existing EventDocumentation record using its documentation ID.

## Controller Method
updateEventDocumentation(req, res)

---

## Path Params

Required:
- id (string) -> Documentation ID

---

## Request Body

You can update one or more fields:

{
  "name": "updated_name",
  "title": "Updated Title",
  "content": "Updated content"
}

---

## Success Response (200)

{
  "message": "eventdocumentation updated successfully",
  "data": {
    "id": "doc_id",
    "name": "updated_name",
    "title": "Updated Title",
    "content": "Updated content",
    "eventId": "event_id"
  },
  "error": null
}

---

## Failure Responses

### 404 Not Found
If documentation record doesn't exist:

{
  "message": "Event does not exists"
}

### 500 Internal Server Error
If update fails:

{
  "message": "Internal server error"
}

---

# 5) Delete Event Documentation

## Endpoint
DELETE /api/event-docs/:id

Example:
DELETE /api/event-docs/doc_id

## Purpose
Deletes an EventDocumentation record using its documentation ID.

## Controller Method
deleteEventDocumentation(req, res)

---

## Path Params

Required:
- id (string) -> Documentation ID

---

## Success Response (204)

{
  "message": "EventDocumentation deleted successfully",
  "data": {
    "id": "doc_id",
    "name": "doc_name",
    "title": "Doc Title",
    "content": "Documentation content here",
    "eventId": "event_id"
  },
  "error": null
}

---

## Failure Responses

### 404 Not Found
If invalid ID or documentation does not exist:

{
  "message": "Invalid id: Event for deletion does not exist in the db"
}

### 500 Internal Server Error
If delete fails:

{
  "message": "Internal server error"
}
