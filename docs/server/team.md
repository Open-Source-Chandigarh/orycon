# Team API Documentation

This document contains backend API documentation for **Team routes**.

These APIs are handled inside:
apps/server/src/controller/team.controller.ts

---

## Base Route

The exact base route depends on routing configuration.
Most likely base path:

/api/team

---

## Authentication & Authorization

Some Team routes require authentication.

The controller expects:

req.user = {
  id: string,
  email: string,
  role: "ADMIN" | "LEAD" | ...
}

### Allowed Roles
- ADMIN
- LEAD

If role is not ADMIN/LEAD, API returns:

403 Unauthorized

---


###  Success responses (examples)

1) For create team:
{
  "team": { ... }
}

2) For update/get/remove:
{
  "error": false,
  "message": "Success message",
  "data": {}
}

###  Failure responses (examples)

{
  "message": "Error message",
  "error": true,
  "data": null
}

---

# 1) Create Team

## Endpoint
POST /api/team/create

## Purpose
Creates a new team in the database.

Only users with role ADMIN or LEAD can create teams.

## Controller Method
createTeam(req, res)

---

## Authentication
Required

### Roles Allowed
- ADMIN
- LEAD

---

## Request Body

{
  "data": {
    "name": "Team Name",
    "description": "Team description"
  }
}

### Required Fields
- data (object)
- data.name (string)

Optional:
- data.description (string)

---

## Success Response (200)

{
  "team": {
    "id": "team_id",
    "name": "Team Name",
    "description": "Team description"
  }
}

---

## Failure Responses

### 401 / Auth Error
If user missing in req.user:

{
  "message": "User not authenticated",
  "error": true,
  "data": null
}

### 403 Forbidden
If user role is not ADMIN/LEAD:

{
  "message": "Unauthorized: Only admins or leads can create teams",
  "error": true,
  "data": null
}

### Other Possible Error Messages
- error in team data
- a team by this name exists
- Couldn't store inside the database

Example:
{
  "message": "a team by this name exists",
  "error": true,
  "data": null
}

---

# 2) Remove Team

## Endpoint
DELETE /api/team/remove

## Purpose
Removes a team from the database using its name.

Only users with role ADMIN or LEAD can remove teams.

## Controller Method
removeTeam(req, res)

---

## Authentication
Required

### Roles Allowed
- ADMIN
- LEAD

---

## Request Body

{
  "name": "Team Name"
}

### Required Fields
- name (string)

---

## Success Response (200)

{
  "data": {
    "count": 1
  },
  "message": "team removed successfully",
  "error": false
}

> Note: deleteMany() returns count of deleted entries.

---

## Failure Responses

### 401 / Auth Error
If user missing:

{
  "message": "User not authenticated",
  "error": true,
  "data": null
}

### 403 Forbidden
If role not allowed:

{
  "error": true,
  "message": "Unauthorized: Only admins or leads can remove teams",
  "data": null
}

### 400 Bad Request
If team name missing:

{
  "data": null,
  "message": "teamname required",
  "error": true
}

### Other Possible Error Messages
- no such team found
- failed to remove team

Example:
{
  "data": null,
  "message": "no such team found",
  "error": true
}

---

# 3) Update Team

## Endpoint
PUT /api/team/:id

Example:
PUT /api/team/abc123

## Purpose
Updates a team using its ID.

Only users with role ADMIN or LEAD can update teams.

## Controller Method
updateTeam(req, res)

---

## Authentication
Required

### Roles Allowed
- ADMIN
- LEAD

---

## Path Params

Required:
- id (string) -> Team ID

---

## Request Body

You can update one or more fields:

{
  "name": "Updated Team Name",
  "description": "Updated Team Description"
}

### Rules
- Team id is required
- At least one of name or description is required

---

## Success Response (200)

{
  "error": false,
  "message": "Team updated successfully",
  "data": {
    "id": "team_id",
    "name": "Updated Team Name",
    "description": "Updated Team Description"
  }
}

---

## Failure Responses

### 401 Not Authenticated
If user missing:

{
  "error": true,
  "message": "User not authenticated",
  "data": null
}

### 403 Forbidden
If role not allowed:

{
  "error": true,
  "message": "Unauthorized: Only admins or leads can make changes in teams",
  "data": null
}

### 400 Bad Request
If id missing:

{
  "error": true,
  "message": "Team Id is required",
  "data": null
}

If no update fields:

{
  "error": true,
  "message": "At least one field is required to update",
  "data": null
}

### 500 Internal Server Error
{
  "error": true,
  "message": "Something went wrong",
  "data": null
}

---

# 4) Get All Teams

## Endpoint
GET /api/team

## Purpose
Fetches all teams.

## Controller Method
getAllTeams(req, res)

---

## Authentication
Not required (based on controller signature)

---

## Request Body
No request body required.

---

## Success Response (200)

### If teams exist
{
  "data": [
    {
      "id": "team_id",
      "name": "Team Name",
      "description": "Team description"
    }
  ],
  "message": "teams fetched successfully",
  "error": false
}

### If no teams exist
{
  "data": [],
  "message": "no team found",
  "error": false
}

---

## Failure Response
{
  "data": null,
  "message": "something went wrong",
  "error": true
}
