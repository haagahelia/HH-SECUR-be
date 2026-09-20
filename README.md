# HH-SECUR-be
Backend and Database for HH-SECUR-i

## Endpoints

<details>

<summary>

**/status** - GET: Server status check

</summary>

Responds `{ok: true}` if server is running. Doesn't require successful database connection.

</details>

<details>

<summary>

**/login** - POST: Login endpoint with username and password payload

</summary>

**Request body format:**

```
{
    "username": "user",
    "password": "password"
}

```

Credentials for default user and admin are defined in env variables.

</details>

<details>

<summary>

**/users** - GET: List of users with password hash omitted

</summary>

    - Returns list of users with password_hash omitted

    - Requires authentication

Responses:

    - Failures: 401: Auth failure

</details>

<details>

<summary>

**/users/{id}** - GET: User by the specific id with password hash omitted

</summary>

    - Returns specific user by ID

    - Requires authentication

Responses:

    - Success: 200

    - Failures: 401: Auth failure, 404: user not found
    
</details>

<details>

<summary>

**/users** - POST: Post a new user with user data in the request body

</summary>

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
    
</details>

<details>

<summary>

**/users/{id}** - PATCH: Update user values with omitted fields retaining old values

</summary>

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

</details>

<details>

<summary>

**/users/{id}** - DELETE: Delete user by id

</summary>

    - Deletes a specific user
    
    - Requires authentication and admin role

Responses:

    - Success: 200 - User has been deleted message

    - Failures: 401, 403 - Auth failures, 404 - User not found

</details>

<details>

<summary>

**/dalculaterisk** - POST: Risk calculation endpoint

</summary>

**Work in progress: features only partially implemented**



Requires: authentication

Request body:

```
{
    "hhrole": "coordinator",
    "collaborationtype": ["option1", "option2"]
    "country": "FIN",
    "organization": "HH",
    "organizationtype": "university",
    "history": "yes",
    "contract": "yes",
    "funding": "yes",
    "liability": "0",
    "personalinformation": "yes",
    "dualuse": "yes",
    "ethics": "1",
    "duration": "1"
}
```

Valid values ("" around a number means it's string type):

```
country: 3 letter country code
organization: organization string id
hhrole: coordinator | partner | other
collaborationtype: [ option1 | option2 | option3 | option4 | option5 | option6 | option7 ]
organizationtype: university | otherresearch | business | ngo | other
history: yes | no
contract: yes | no
funding: yes | no
liability: "0" | "20.000" | "50.000"
personalinformation: yes | no
dualuse: yes | no | unknown
ethics: "1" | "2" | "3" | "4" | "5"
duration: "1" | "2" | "3"
```

Responses:

    - Success: 200 - Risk report with 0 - 3 range for risk factors

        - 0 for a risk factor means calculation failed likely due to invalid value in the request body

    - Failures: 401 - Auth failure, 422 - Missing fields from request body, missing fields listed

Response body:

```
{
    "collaboration": 0-3,
    "country": {
        "overall": 0-3,
        "corruption": 0-3,
        "security": 0-3,
        "academicfreedom": 0-3,
        "politicalstability": 0-3,
        "development": 0-3,
        "gdpr": 0-3,
        "sanctions": 0-3,
        "ruleoflaw": 0-3,
    },
    "organization": 0-3,
    "financial": {
        "overall": 0-3,
        "exchange": 0-3,
        "scope": 0-3
    },
    "dualuse": 0-3,
    "ethics": 0-3,
    "realCalculationImpementedFor": [
        "implemented calculation 1",
        "implemented calculation 2"
    ]
}
```

`realCalculationImpementedFor` is a placeholder response that will be removed once risk calculation has been fully implemented. Risk categories listed there are ready to replace the old risk source in front end.



</details>

<details>

<summary>

**/tokenstatus** - GET: Check auth token validity

</summary>
    - Uses Bearer authentication to look for valid token.

Responses:

    - Success: {"token": "accepted"}
    
    - Failed: failure status response from auth middleware

</details>

<details>

<summary>

**/tokenstatusadmin** - GET: Check admin auth token validity

</summary>

Checks for token authenticity and if that passes checks for admin role.

Responses:

    - Authentic token with admin role: {"adminAccess" : true}

    - Authentic token without admin role: {"message": "Admin status required"}

    - Token check failed: failure status response from auth middleware

</details>

<details>

<summary>

**/defaultuser** - GET: Generates default user or updates it to default values

</summary>

Creates default user. Updates values to default if email is already present.

Requires following env variables set:

```
DEFAULT_USER_USERNAME=username
DEFAULT_USER_PASSWORD=password
DEFAULT_USER_EMAIL=email
DEFAULT_USER_ROLE=user
```

</details>

<details>

<summary>

**/defaultadmin** - GET: Generates default admin or updates it to default values

</summary>

Creates default user with admin role. Updates values to default if email is already present.

Requires following env variables set:

```
DEFAULT_ADMIN_USERNAME=adminUsername
DEFAULT_ADMIN_PASSWORD=adminPassword
DEFAULT_ADMIN_EMAIL=email
DEFAULT_ADMIN_ROLE=admin
```

</details>

## env variable template

Use .env file locally in the root directory and update values to match your environment.

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=YourPassword
DB_DATABASE=YourDatabaseName
JWT_SECRET=secretForJWTTokenGeneration
DEFAULT_USER_USERNAME=usernameForDefaultUser
DEFAULT_USER_PASSWORD=passwordForDefaultUser
DEFAULT_USER_EMAIL=emailForDefaultUser
DEFAULT_USER_ROLE=user
DEFAULT_ADMIN_USERNAME=usernameForDefaultAdmin
DEFAULT_ADMIN_PASSWORD=passwordForDefaultAdmin
DEFAULT_ADMIN_EMAIL=emailForDefaultAdmin
DEFAULT_ADMIN_ROLE=admin
```

# Docker Compose Guide (HH-SECUR-be)

## 1. Prerequisites

* Docker Desktop running (check with `docker info`, should return no error)
* `.env` file in the project root, every developer needs their own copy on their own machine. It's in `.gitignore` (`.gitignore:69-70`) and is not version-controlled, since it contains passwords and secrets, share it with the team through some other channel (not via Git).

## 2. `.env` file contents

```env
# be.env
PORT=3000
BE_SERVER_PORT=3000

# db.env, app-side connection settings (config.ts)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=<your-value>
DB_PASSWORD=<your-value>
DB_DATABASE=<your-value>

# db.image.env, MariaDB container's init variables (must be the SAME values as above)
MARIADB_DATABASE=<same as DB_DATABASE>
MARIADB_USER=<same as DB_USERNAME>
MARIADB_PASSWORD=<same as DB_PASSWORD>
MARIADB_ROOT_PASSWORD=<your-value>

# auth.env
JWT_SECRET=<your-value>

# default seed credentials (/defaultuser, /defaultadmin)
DEFAULT_USER_USERNAME=user
DEFAULT_USER_EMAIL=user@testing.com
DEFAULT_USER_PASSWORD=<your-value>
DEFAULT_USER_ROLE=user

DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_EMAIL=admin@testing.com
DEFAULT_ADMIN_PASSWORD=<your-value>
DEFAULT_ADMIN_ROLE=admin
```

> **Note:** `DB_PORT` must be `3306`, containers always talk to each other on MariaDB's internal port, regardless of the host-side port mapping. `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` must exactly match `MARIADB_USER` / `MARIADB_PASSWORD` / `MARIADB_DATABASE`.

## 3. Starting it up

First time, or whenever the code / Dockerfile / package.json has changed:

```bash
docker compose -f docker-compose-dbbe.yaml up --build
```

If the image is already built and nothing has changed since, `--build` isn't needed, plain `up` is enough and starts faster:

```bash
docker compose -f docker-compose-dbbe.yaml up
```

Both do the same basic sequence:

1. The backend is built from the `Dockerfile` if needed (`npm ci` → `npm run build` → `npm start`)
2. `hh_secur_db_service` (MariaDB) starts, and it waits until it's healthy (`healthcheck`)
3. `hh_secur_be_service` starts only once the db is healthy, connecting to it internally via `hh_secur_db_service` (the Docker network's service name, not `localhost`)

Run in the background by adding `-d` (works with either command):

```bash
docker compose -f docker-compose-dbbe.yaml up -d
```

Check what already exists:

```bash
docker compose -f docker-compose-dbbe.yaml ps
docker images
```

## 4. Signs of success in the logs

```
Backend is running
Succsefully connected to database
API running on 3000
```

## 5. Testing

```bash
curl http://localhost:3000/status
```

→ `{"ok": true}`

The full test flow (login, tokens, default users), in short:

1. `POST /login` → get a token
2. `GET /defaultuser` and `GET /defaultadmin` create test users in the DB
3. `GET /users/{id}` fetches them

## 6. Stopping it

```bash
docker compose -f docker-compose-dbbe.yaml down
```

The database persists across restarts via the named volume (`hh_secur_db_data`), including the next `up` without `--build`. Add `-v` if you want a clean/empty database:

```bash
docker compose -f docker-compose-dbbe.yaml down -v
```

## 7. Common pitfalls (we already hit these)

* Docker Desktop not running → `npipe` error right away.
* `.dockerignore` must not exclude `package-lock.json`, already fixed at `.dockerignore:48`, but if the `#` in front is ever removed by accident, `npm ci` will fail during the build.
* `.env` values don't match (`DB_*` vs `MARIADB_*`) → the database connection fails on startup.
* Forgetting `--build` after a code change → the container starts with the old code and your changes won't show up.
