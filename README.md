# HH-SECUR-be
Backend and Database for HH-SECUR-i

## Endpoints

**/status** - GET

Responds `{ok: true}` if server is running. Doesn't require succesfull database connection.

**/login** - POST

**Request body format:**

```
{
    "username": "user",
    "password": "password"
}

```
Until user model and repository implementation `user` and `password` are the credentials for testing. After the implementation consult internal documentation.

**/tokenstatus**

Uses Bearer authentication to look for valid token.

**Responses:**
    - Success: {"token": "accepted"}
    - Failed: failure status response from auth middleware