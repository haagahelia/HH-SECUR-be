# HH-SECUR-be
Backend and Database for HH-SECUR-i

## Endpoints

**/status** - GET

Responds `{ok: true}` if server is running. Doesn't require succesfull database connection.

**/users/{id}** - GET

Fetches user by the id of {id}

**Responses:**

    - Success: 200

        {
            user: {
                id: number,
                username: string,
                email: string,
                password_hash: string,
                role: string,
                created_at: DATE,
                updated_at: DATE
            }
        }

    - Not a number failure: 400

        {
            message: "Requested id {id} is not a number
        }

    - User not found failure: 404

        {
            message: "User by the id of {id} does not exist"
        }



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

**/tokenstatusadmin**

Checks for token authenticity and if that passes checks for admin role.

**Responses:**

    - Authentic token with admin role: {"adminAccess" : true}

    - Authentic token without admin role: {"message": "Admin status required"}

    - Token check failed: failure status response from auth middleware

**/defaultuser**

Creates default user, first deletes it if email is already present.

Requires following env variables set:

```
DEFAULT_USER_USERNAME=username
DEFAULT_USER_PASSWORD=password
DEFAULT_USER_EMAIL=email
```