# User API Documentation

This document contains backend API documentation for **User Authentication & User Update routes**.

These APIs are handled inside:
apps/server/src/controller/user.controller.ts

---

## Base Route

The exact base route depends on routing configuration.
Most likely base path:

/api/user

---


### Success Response Patterns

1) Signup success:
{
  "data": { ... },
  "message": "user created successfully",
  "error": null
}

2) Login success:
{
  "token": "jwt_token_here"
}

3) Update user success:
{
  "message": "User updated successfully",
  "error": false,
  "newData": { ... }
}

###  Failure Response Pattern

{
  "data": null,
  "message": "Error message",
  "error": true
}

Some routes return:
{
  "message": "Error message",
  "error": true
}

---

# 1) Email Signup

## Endpoint
POST /api/user/signup

## Purpose
Creates a new user account using email + password.

Validations:
- ensures required fields exist
- checks user already exists by email OR rollnumber
- hashes password using bcrypt
- generates JWT after signup

## Controller Method
handleEmailSignup(req, res)

---

## Request Body

{
  "name": "User Name",
  "rollNumber": "22CS001",
  "email": "user@gmail.com",
  "password": "password123"
}

### Required Fields
- name (string)
- rollNumber (string)
- email (string)
- password (string)

---

## Success Response (200)

{
  "data": {
    "id": "user_id",
    "email": "user@gmail.com",
    "name": "User Name",
    "rollNumber": "22CS001",
    "token": "jwt_token_here"
  },
  "message": "user created successfully",
  "error": null
}

---

## Failure Responses (400)

### Possible Failure Messages
- missing data name
- missing data rollNumber
- missing data email
- missing data password
- user already exists
- user not created

### Example Failure Response
{
  "data": null,
  "message": "user already exists",
  "error": true
}

---

# 2) Email Login

## Endpoint
POST /api/user/login

## Purpose
Logs in a user using email + password and returns JWT token.

Validations:
- ensures required fields exist
- checks if user exists by email OR rollnumber
- verifies password using bcrypt
- generates JWT on success

## Controller Method
handleEmailLogin(req, res)

---

## Request Body

{
  "rollNumber": "22CS001",
  "email": "user@gmail.com",
  "password": "password123"
}

### Required Fields
- rollNumber (string)
- email (string)
- password (string)

---

## Success Response (200)

{
  "token": "jwt_token_here"
}

---

## Failure Responses (400)

### Possible Failure Messages
- missing data rollNumber
- missing data email
- missing data password
- user doesn't exists
- Invalid credentials

### Example Failure Response
{
  "data": null,
  "message": "Invalid credentials",
  "error": true
}

---

# 3) OAuth Signup (Google/GitHub)

## Endpoint
INTERNAL (not an Express route)

## Purpose
Creates a user account when signing up via OAuth providers like Google or GitHub.

This function is called internally (not via req/res).

## Controller Method
handleOAuthSignup(name, email)

---

## Function Inputs

name: string
email: string

---

## Success Output
Returns created user object from database.

---

## Failure Output
Returns null if creation fails.

---

# 4) OAuth Login

## Endpoint
NOT IMPLEMENTED

## Purpose
Placeholder function for future OAuth login support.

## Controller Method
handleOAuthLogin(data)

---

# 5) Update User Details

## Endpoint
PUT /api/user/update

## Purpose
Updates user details in database.

Validations:
- id is required
- user must exist
- password (if provided) will be hashed

## Controller Method
updateUserDetails(req, res)

---

## Request Body

{
  "id": "user_id",
  "name": "Updated Name",
  "email": "updated@gmail.com",
  "rollnumber": "22CS999",
  "password": "newpassword123"
}

### Required Fields
- id (string)

Optional fields (any can be updated):
- name (string)
- email (string)
- rollnumber (string)
- password (string)

---

## Success Response (200)

{
  "message": "User updated successfully",
  "error": false,
  "newData": {
    "id": "user_id",
    "name": "Updated Name",
    "email": "updated@gmail.com",
    "rollnumber": "22CS999",
    "role": "USER",
    "updatedAt": "2026-01-14T00:00:00.000Z"
  }
}

---

## Failure Responses

### 400 Bad Request
If id missing:

{
  "message": "User id is missing",
  "error": true
}

### 404 Not Found
If user not found:

{
  "message": "User not found",
  "error": true
}

### 500 Internal Server Error
If update fails:

{
  "message": "Internal server error message",
  "error": true
}

---

## JWT Token Info (Helper)

JWT is generated using:
generateJWT(data)

### Payload
{
  "id": "user_id",
  "email": "user@gmail.com",
  "rollNumber": "22CS001"
}

### Expiry
15 days

If token creation fails, function returns null.
