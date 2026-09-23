# HH-SECUR-be
Backend and Database for HH-SECUR-i

## Endpoints

**/status** - GET

Responds `{ok: true}` if server is running. Doesn't require successful database connection.

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

Credentials for default user and admin are defined in env variables.

**/users** - GET

    - Returns list of users with password_hash omitted

    - Requires authentication

Responses:

    - Failures: 401: Auth failure

**/users/{id}** - GET

    - Returns specific user by ID

    - Requires authentication

Responses:

    - Success: 200

    - Failures: 401: Auth failure, 404: user not found

**/users** - POST

    - Create new user

    - Requires authentication and admin role

Request body:

```
{
    "username": "Username",
    "email": "valid@emailformat.com",
    "password": "password",
    "role": "role"
}
```

Requirements:

    - Not empty / null: username, email, password, role

    - Unique: username, email

    - Valid format: email

Responses:

    - Success: 200 - Json of generated user with password_hash omitted

    - Failures: 401, 403: Auth errors, 422: Validation errors

**/users/{id}** - PATCH

    - Update information of a specific user.

    - Requires authentication and admin role

Request body (attributes can be omitted, only included ones will be updated):

```
{
    "username": "Username",
    "email": "valid@emailformat.com",
    "password": "password",
    "role": "role"
}
```

Responses:

    - Success: 200 - Success message and updated json of user with password_hash omitted

    - Failures: 401, 403 - Auth failures

**/users/{id}** - DELETE

    - Deletes a specific user
    
    - Requires authentication and admin role

Responses:

    - Success: 200 - User has been deleted message

    - Failures: 401, 403 - Auth failures, 404 - User not found


**/tokenstatus**

    - Uses Bearer authentication to look for valid token.

Responses:

    - Success: {"token": "accepted"}
    
    - Failed: failure status response from auth middleware

**/tokenstatusadmin**

Checks for token authenticity and if that passes checks for admin role.

Responses:

    - Authentic token with admin role: {"adminAccess" : true}

    - Authentic token without admin role: {"message": "Admin status required"}

    - Token check failed: failure status response from auth middleware

**/defaultuser**

Creates default user. Updates values to default if email is already present.

Requires following env variables set:

```
DEFAULT_USER_USERNAME=username
DEFAULT_USER_PASSWORD=password
DEFAULT_USER_EMAIL=email
DEFAULT_USER_ROLE=user
```

**/defaultadmin**

Creates default user with admin role. Updates values to default if email is already present.

Requires following env variables set:

```
DEFAULT_ADMIN_USERNAME=adminUsername
DEFAULT_ADMIN_PASSWORD=adminPassword
DEFAULT_ADMIN_EMAIL=email
DEFAULT_ADMIN_ROLE=admin
```

## Testing

API tests are written with [Playwright](https://playwright.dev/) (`@playwright/test`) and cover `/login`, `/tokenstatus`, `/tokenstatusadmin`, `/defaultuser` and `/defaultadmin`. Test files live in `tests/api/`.

### Requirements

- The backend API must be running and reachable (default: `http://localhost:3000`).
- The database must be running and reachable by the API.
- The `.env` file must be set up (see variables referenced throughout this README), especially `JWT_SECRET`, `DB_*` and `DEFAULT_USER_*` / `DEFAULT_ADMIN_*`.

Start the API and database with Docker Compose:

```
docker compose -f docker-compose-dbbe.yaml up -d
```

Or run them locally instead (requires a running MariaDB instance matching the `DB_*` env variables):

```
npm run dev
```

Test data (the default user and admin) is created/reset automatically before the test run via a Playwright `globalSetup` that calls `/defaultuser` and `/defaultadmin` — no manual seeding needed.

### Running the tests

```
npm test
```

Runs the full Playwright suite headlessly against the API.

```
npm run test:ui
```

Opens Playwright's UI mode for interactively running and debugging individual tests.

By default tests target `http://localhost:3000` (or `PORT` from `.env`). To point tests at a different URL, set `API_BASE_URL`:

```
API_BASE_URL=http://localhost:4000 npm test
```