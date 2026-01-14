# Event Participant API Documentation

This document contains backend API documentation for **Event Participant routes**.

These APIs are handled inside:
apps/server/src/controller/eventParticipant.controller.ts

---

## Base Route

The exact base route depends on routing configuration.
Most likely base path:

/api/event-participant

---

## Common Response Format

All endpoints return JSON in the following format:

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

# 1) Register Participant

## Endpoint
POST /api/event-participant/register

## Purpose
Registers a user as a participant in an event.

Validations done:
- user must exist
- event must exist
- participant should not already be registered

## Controller Method
registerParticipant(req, res)

---

## Request Body

{
  "data": {
    "userId": "user_id",
    "eventId": "event_id",
    "entryType": "ONLINE"
  }
}

### Required Fields
- data.userId (string)
- data.eventId (string)
- data.entryType (string)

---

## Success Response (200)

{
  "data": {
    "userId": "user_id",
    "eventId": "event_id",
    "entryType": "ONLINE",
    "isPresent": "ABSENT"
  },
  "message": "Entry created successfully",
  "error": null
}

---

## Failure Responses

### Possible Failure Messages
- No User Found, Kindly Register
- No Event Found
- Already Registered
- Couldn't Create Entry

### Example Failure Response
{
  "data": null,
  "message": "Already Registered",
  "error": {}
}

---

# 2) Get User Registration

## Endpoint
POST /api/event-participant/user-registration

## Purpose
Fetches all events in which a user is registered.

Validations:
- userId must be provided
- user must exist

## Controller Method
getUserRegistration(req, res)

---

## Request Body

{
  "userId": "user_id"
}

### Required Fields
- userId (string)

---

## Success Response (200)

### If registrations exist
{
  "data": [
    {
      "userId": "user_id",
      "eventId": "event_id",
      "entryType": "ONLINE",
      "isPresent": "ABSENT"
    }
  ],
  "message": "Events fetched",
  "error": null
}

### If user has no registrations
{
  "data": [],
  "message": "No Events Found",
  "error": null
}

---

## Failure Responses

### Possible Failure Messages
- User id not found
- No User Found, Kindly Register

### Example Failure Response
{
  "data": null,
  "message": "User id not found",
  "error": {}
}

---

# 3) Get Paginated Registration For Event

## Endpoint
POST /api/event-participant/event-registrations

## Purpose
Fetches registered participants for a specific event in a paginated manner.

Pagination:
- returns MAX_EVENT = 30 registrations per page

## Controller Method
getPaginatedRegistrationForEvent(req, res)

---

## Request Body

{
  "pageNumber": 1,
  "eventId": "event_id"
}

### Required Fields
- eventId (string)

Optional:
- pageNumber (number)

> Note: If pageNumber is null, controller uses 0.

---

## Success Response (200)

### If participants exist
{
  "data": [
    {
      "userId": "user_id",
      "eventId": "event_id",
      "entryType": "ONLINE",
      "isPresent": "ABSENT"
    }
  ],
  "message": "Event Participants Found",
  "error": null
}

### If no participants exist
{
  "data": [],
  "message": "No Event Participants Found",
  "error": null
}

---

## Failure Responses

### Possible Failure Messages
- No Event Found

### Example Failure Response
{
  "data": null,
  "message": "No Event Found",
  "error": {}
}

---

# 4) Mark Event Attendance

## Endpoint
POST /api/event-participant/mark-attendance

## Purpose
Marks a registered participant as PRESENT for a specific event.

Validations:
- user must exist
- event must exist
- participant must already be registered

## Controller Method
markEventAttendance(req, res)

---

## Request Body

{
  "data": {
    "userId": "user_id",
    "eventId": "event_id"
  }
}

### Required Fields
- data.userId (string)
- data.eventId (string)

---

## Success Response (200)

{
  "data": {
    "userId": "user_id",
    "eventId": "event_id",
    "isPresent": "PRESENT"
  },
  "message": "Attendence marked successfully",
  "error": null
}

---

## Failure Responses

### Possible Failure Messages
- No User Found, Kindly Register
- No Event Found
- User Not Registered
- Couldn't mark attendence

### Example Failure Response
{
  "data": null,
  "message": "User Not Registered",
  "error": {}
}

---

# 5) Walk-in Registration

## Endpoint
POST /api/event-participant/walkin

## Purpose
Registers a user as a WALKIN participant and directly marks them as PRESENT.

Validations:
- user must exist
- event must exist
- user must not already be registered

## Controller Method
handleWalkInRegistration(req, res)

---

## Request Body

{
  "data": {
    "userId": "user_id",
    "eventId": "event_id"
  }
}

### Required Fields
- data.userId (string)
- data.eventId (string)

---

## Success Response (200)

{
  "data": {
    "userId": "user_id",
    "eventId": "event_id",
    "entryType": "WALKIN",
    "isPresent": "PRESENT"
  },
  "message": "Walkin Registration Successful",
  "error": null
}

---

## Failure Responses

### Possible Failure Messages
- No User Found, Kindly Register
- No Event Found
- Already Registered
- Couldn't create Registration

### Example Failure Response
{
  "data": null,
  "message": "Already Registered",
  "error": {}
}
