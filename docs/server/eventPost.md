# Event Post API Documentation

This document contains backend API documentation for **Event Post routes**.

These APIs are handled inside:
apps/server/src/routes/event-post/eventPost.route.ts
and controller:
apps/server/src/controller/eventPost.controller.ts

---

## Base Route

The base route depends on where this router is mounted in the main server file.

This router defines these endpoints under its base route:

- POST /
- GET /
- GET /:id
- PUT /:id
- DELETE /:id

Example base path (commonly used):
/api/event-post

So full example endpoints become:
- POST /api/event-post
- GET /api/event-post
- GET /api/event-post/:id
- PUT /api/event-post/:id
- DELETE /api/event-post/:id

---


###  Success Response (Example)
{
  "data": {},
  "message": "Success message",
  "error": null
}

###  Failure Response (Example)
{
  "data": null,
  "message": "Error message",
  "error": {}
}

---

# 1) Create Event Post

## Endpoint
POST /

Example:
POST /api/event-post

## Purpose
Creates a new event post entry.

## Controller Method
createEventPost(req, res)

---

## Request Body
Request body depends on the model/controller.
Example format:

{
  "title": "Post title",
  "content": "Post content",
  "eventId": "event_id",
  "authorId": "user_id"
}

---

## Success Response
Expected:
- 201 Created OR 200 OK
Returns created post object.

---

## Failure Response
Possible:
- 400 Bad Request
- 500 Internal Server Error

---

# 2) Get All Event Posts

## Endpoint
GET /

Example:
GET /api/event-post

## Purpose
Fetches all event posts.

## Controller Method
getAllEventPosts(req, res)

---

## Request Body
No request body required.

---

## Success Response
Expected:
- 200 OK
Returns array of event posts:

[
  {
    "id": "post_id",
    "title": "Post title",
    "content": "Post content",
    "eventId": "event_id"
  }
]

---

## Failure Response
Possible:
- 500 Internal Server Error

---

# 3) Get Event Post By ID

## Endpoint
GET /:id

Example:
GET /api/event-post/abc123

## Purpose
Fetches one event post by post ID.

## Controller Method
getEventPostById(req, res)

---

## Path Params
Required:
- id (string) -> Post ID

---

## Success Response
Expected:
- 200 OK
Returns single event post object:

{
  "id": "post_id",
  "title": "Post title",
  "content": "Post content",
  "eventId": "event_id"
}

---

## Failure Response
Possible:
- 404 Not Found
- 500 Internal Server Error

---

# 4) Update Event Post

## Endpoint
PUT /:id

Example:
PUT /api/event-post/abc123

## Purpose
Updates an existing event post by ID.

## Controller Method
updateEventPost(req, res)

---

## Path Params
Required:
- id (string) -> Post ID

---

## Request Body
Send updated fields (example):

{
  "title": "Updated title",
  "content": "Updated content"
}

---

## Success Response
Expected:
- 200 OK
Returns updated post object.

---

## Failure Response
Possible:
- 404 Not Found
- 400 Bad Request
- 500 Internal Server Error

---

# 5) Delete Event Post

## Endpoint
DELETE /:id

Example:
DELETE /api/event-post/abc123

## Purpose
Deletes an event post by ID.

## Controller Method
deleteEventPost(req, res)

---

## Path Params
Required:
- id (string) -> Post ID

---

## Success Response
Expected:
- 200 OK OR 204 No Content

---

## Failure Response
Possible:
- 404 Not Found
- 500 Internal Server Error
