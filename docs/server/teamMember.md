# Team Member API Documentation

This document contains backend API documentation for **Team Member routes**.

These APIs are handled inside:
apps/server/src/controller/teamMember.controller.ts

---

## Base Route

The exact base route depends on routing configuration.
Most likely base path:

/api/team-member

---

## Authentication & Authorization

### Authentication Required
For these endpoints:
- Create Team Member
- Remove Team Member
- Update Team Member

The controller expects:

req.user.id  (must be present)

If missing, it returns:

401 Unauthorized

---

### Allowed Roles

Only users with the following roles can perform restricted actions:

ALLOWED_ROLES:
- LEAD
- ADMIN
- SUBHEAD

If role is not allowed:

403 Forbidden

---



###  Success Responses
- Create/Update returns member object
- Remove returns message object
- Get members returns array of member objects

###  Failure Responses
Errors generally returned like:

{
  "error": "Error message"
}

---

# 1) Create Team Member

## Endpoint
POST /api/team-member

## Purpose
Creates a new team-member mapping between a user and a team.

Only allowed roles: LEAD, ADMIN, SUBHEAD

## Controller Method
createTeamMember(req, res)

---

## Authentication
Required

### Roles Allowed
- LEAD
- ADMIN
- SUBHEAD

---

## Request Body

{
  "userId": "user_id",
  "teamId": "team_id"
}

### Required Fields
- userId (string)
- teamId (string)

---

## Success Response (201)

Returns created team member including user and team details:

{
  "id": "member_id",
  "userId": "user_id",
  "teamId": "team_id",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "role": "LEAD"
  },
  "team": {
    "id": "team_id",
    "name": "Team Name"
  }
}

---

## Failure Responses

### 401 Unauthorized
If req.user.id is missing:

{
  "error": "Unauthorized: missing user ID"
}

### 404 Not Found
If user not found in database:

{
  "error": "User not found"
}

### 403 Forbidden
If user role not allowed:

{
  "error": "Forbidden: insufficient role"
}

### 500 Internal Server Error
If server fails:

{
  "error": "Some error message"
}

---

# 2) Remove Team Member

## Endpoint
DELETE /api/team-member/:memberId

Example:
DELETE /api/team-member/abc123

## Purpose
Removes a team member entry using memberId.

Only allowed roles: LEAD, ADMIN, SUBHEAD

## Controller Method
removeTeamMember(req, res)

---

## Authentication
Required

### Roles Allowed
- LEAD
- ADMIN
- SUBHEAD

---

## Path Params

Required:
- memberId (string) -> TeamMember ID

---

## Success Response (200)

{
  "message": "Team member removed successfully"
}

---

## Failure Responses
Same authorization errors apply:

### 401 Unauthorized
{
  "error": "Unauthorized: missing user ID"
}

### 404 Not Found
{
  "error": "User not found"
}

### 403 Forbidden
{
  "error": "Forbidden: insufficient role"
}

### 500 Internal Server Error
{
  "error": "Some error message"
}

---

# 3) Update Team Member

## Endpoint
PUT /api/team-member/:memberId

Example:
PUT /api/team-member/abc123

## Purpose
Updates an existing TeamMember record.

Only allowed roles: LEAD, ADMIN, SUBHEAD

## Controller Method
updateTeamMember(req, res)

---

## Authentication
Required

### Roles Allowed
- LEAD
- ADMIN
- SUBHEAD

---

## Path Params

Required:
- memberId (string)

---

## Request Body

You can update one or both fields:

{
  "userId": "new_user_id",
  "teamId": "new_team_id"
}

Optional:
- userId (string)
- teamId (string)

---

## Success Response (200)

Returns updated team member including user and team details:

{
  "id": "member_id",
  "userId": "new_user_id",
  "teamId": "new_team_id",
  "user": {
    "id": "new_user_id",
    "name": "User Name",
    "role": "ADMIN"
  },
  "team": {
    "id": "new_team_id",
    "name": "Team Name"
  }
}

---

## Failure Responses
Same authorization errors apply:

### 401 Unauthorized
{
  "error": "Unauthorized: missing user ID"
}

### 404 Not Found
{
  "error": "User not found"
}

### 403 Forbidden
{
  "error": "Forbidden: insufficient role"
}

### 500 Internal Server Error
{
  "error": "Some error message"
}

---

# 4) Get Team Members By Team

## Endpoint
GET /api/team-member/team/:teamId

Example:
GET /api/team-member/team/team123

## Purpose
Fetches all members belonging to a given teamId.

## Controller Method
getTeamMembersByTeam(req, res)

---

## Authentication
Not required (based on controller code)

---

## Path Params

Required:
- teamId (string)

---

## Success Response (200)

Returns an array of team members:

[
  {
    "id": "member_id",
    "userId": "user_id",
    "teamId": "team_id",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "role": "SUBHEAD"
    },
    "team": {
      "id": "team_id",
      "name": "Team Name"
    }
  }
]

---

## Failure Response

### 500 Internal Server Error
{
  "error": "Some error message"
}
