# GitHub Monitor - Authentication Architecture

## 1. Overview

GitHub Monitor has **two authentication purposes**:

1.  **Application Authentication**
    -   Register with username, email and password.
    -   Login using email and password.
    -   The backend generates an application JWT.
    -   The frontend stores the JWT in `localStorage`.
    -   The JWT authenticates requests made to the GitHub Monitor
        backend.
2.  **GitHub OAuth**
    -   Connect an existing GitHub Monitor account with a GitHub
        account.
    -   GitHub provides the GitHub account ID, username, email and
        access token.
    -   These details are associated with the existing application user.
    -   The GitHub access token is later used by the backend to access
        GitHub APIs.

There is also a third user-facing option:

3.  **Continue with GitHub**
    -   Used when a user wants to log into GitHub Monitor using GitHub.
    -   The user does not need an existing application JWT.
    -   GitHub identifies the user.
    -   The backend finds the GitHub Monitor account using `githubId`,
        or creates one if this is the first GitHub login.
    -   The backend then generates the application's JWT.

The important idea is:

``` text
                         Authentication System
                                  |
              +-------------------+-------------------+
              |                   |                   |
       Email Register       Email Login        Continue with GitHub
              |                   |                   |
              +-------------------+-------------------+
                                  |
                             App JWT
                                  |
                         GitHub Monitor User
                                  |
                          Connect GitHub
                                  |
                           GitHub Account
```

------------------------------------------------------------------------

# 2. User Architecture

A GitHub Monitor user can have two identities.

## Application Identity

This belongs to GitHub Monitor itself.

``` text
MongoDB _id
username
email
password
```

## GitHub Identity

This belongs to GitHub.

``` text
githubId
githubUsername
githubEmail
githubAccessToken
avatarUrl
profileUrl
```

They are stored in the same MongoDB user document.

``` mermaid
erDiagram
    USER {
        ObjectId _id
        String username
        String email
        String password
        Number githubId
        String githubUsername
        String githubEmail
        String githubAccessToken
        String avatarUrl
        String profileUrl
        Date createdAt
        Date updatedAt
    }
```

The `githubId` is the unique identity of the connected GitHub account.

------------------------------------------------------------------------

# 3. User Document

A user who registered normally and later connected GitHub can look like:

``` js
{
    _id: ObjectId("..."),

    // GitHub Monitor account
    username: "Sathish",
    email: "sathish@gmail.com",
    password: "hashed-password",

    // GitHub account
    githubId: 123456789,
    githubUsername: "sathish-dev",
    githubEmail: "sathish@gmail.com",
    githubAccessToken: "gho_xxxxxxxxx",

    avatarUrl: "https://avatars.githubusercontent.com/...",
    profileUrl: "https://github.com/sathish-dev",

    createdAt: "...",
    updatedAt: "..."
}
```

The important distinction is:

``` text
username
    ↓
GitHub Monitor username

githubUsername
    ↓
GitHub username

githubId
    ↓
Unique GitHub account identity
```

The application username and GitHub username are independent.

------------------------------------------------------------------------

# 4. Authentication Components

``` text
Frontend
    |
    +-- Register Page
    +-- Login Page
    +-- Connect GitHub Page
    +-- Dashboard
    |
    ↓
Backend
    |
    +-- Auth Routes
    +-- Auth Controller
    +-- JWT Middleware
    +-- GitHub Service
    |
    +----------------+
    |                |
    ↓                ↓
MongoDB          GitHub API
```

------------------------------------------------------------------------

# 5. Complete Authentication Architecture

``` mermaid
flowchart TD

    A[React Frontend]

    A --> B[Register]
    A --> C[Login]
    A --> D[Continue with GitHub]
    A --> E[Connect GitHub]
    A --> F[Dashboard]

    B --> G[POST /api/auth/register]
    C --> H[POST /api/auth/login]

    G --> I[Auth Controller]
    H --> I

    I --> J[(MongoDB)]
    I --> K[Generate Application JWT]
    K --> L[localStorage]

    D --> M[GET /api/auth/github/login]
    M --> N[GitHub OAuth]
    N --> O[GitHub Callback]
    O --> P[Find/Create User by githubId]
    P --> J
    P --> Q[Generate Application JWT]
    Q --> L
    L --> F

    E --> R[GET /api/auth/github/start]
    R --> S[JWT Middleware]
    S --> T[Verify Application JWT]
    T --> U[Get user_id]
    U --> V[Generate OAuth State]
    V --> W[HttpOnly OAuth Cookie]
    V --> N

    O --> X[Verify OAuth State]
    X --> Y[Exchange Authorization Code]
    Y --> Z[GitHub Access Token]
    Z --> AA[GitHub API]
    AA --> AB[GitHub User Data]
    AB --> J
    J --> F
```

------------------------------------------------------------------------

# 6. Three Authentication Flows

There are three important flows in the application.

``` text
1. Email Register
   ↓
   Create application account
   ↓
   JWT
   ↓
   Connect GitHub

2. Email Login
   ↓
   Verify application credentials
   ↓
   JWT
   ↓
   Dashboard

3. Continue with GitHub
   ↓
   GitHub OAuth
   ↓
   Find/Create application account
   ↓
   JWT
   ↓
   Dashboard
```

The important distinction is:

``` text
Connect GitHub
    =
Attach GitHub to an already logged-in user

Continue with GitHub
    =
Use GitHub itself to log into the application
```

These should use separate backend endpoints.

------------------------------------------------------------------------

# 7. Application Registration

Registration creates the GitHub Monitor account.

The user enters:

``` text
Username
Email
Password
Confirm Password
```

The frontend sends:

``` http
POST /api/auth/register
```

Example:

``` json
{
    "username": "Sathish",
    "email": "sathish@gmail.com",
    "password": "password123"
}
```

The backend:

``` text
Validate fields
    ↓
Check email
    ↓
Hash password
    ↓
Create MongoDB user
    ↓
Generate JWT
    ↓
Return JWT
```

------------------------------------------------------------------------

# 8. Registration Flow

``` mermaid
sequenceDiagram
    participant U as User
    participant F as React
    participant B as Backend
    participant DB as MongoDB

    U->>F: Enter username/email/password
    F->>B: POST /api/auth/register
    B->>B: Validate fields
    B->>DB: Find user by email
    DB-->>B: User not found
    B->>B: Hash password using bcrypt
    B->>DB: Create user
    DB-->>B: User created
    B->>B: Generate JWT
    B-->>F: JWT + user information
    F->>F: Store JWT in localStorage
    F->>F: Navigate to /connect-github
```

After registration, the application knows the user but does not
necessarily know their GitHub account.

Therefore:

``` text
Register
   ↓
Application User created
   ↓
Connect GitHub
   ↓
GitHub Identity attached
```

------------------------------------------------------------------------

# 9. Password Handling

Passwords are never stored directly.

The password:

``` text
password123
```

is passed through bcrypt:

``` text
password123
    ↓
bcrypt.hash()
    ↓
Password Hash
    ↓
MongoDB
```

During login:

``` text
Input password
    ↓
bcrypt.compare()
    ↓
Stored password hash
    ↓
true / false
```

------------------------------------------------------------------------

# 10. Application JWT

After successful registration or email/password login, the backend
creates a JWT.

Payload:

``` json
{
    "user_id": "65xxxxxxxxxxxxxxxx"
}
```

The JWT is signed using:

``` env
JWT_SECRET_KEY=your_secret
```

The token expires after:

``` text
7 days
```

The JWT represents:

``` text
"This request belongs to this GitHub Monitor user."
```

------------------------------------------------------------------------

# 11. JWT Flow

``` mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    F->>B: Login credentials
    B->>DB: Find user
    DB-->>B: User
    B->>B: Validate password
    B->>B: Generate JWT
    B-->>F: JWT
    F->>F: localStorage.setItem("token", JWT)
```

------------------------------------------------------------------------

# 12. Sending the JWT

Authenticated API requests send:

``` http
Authorization: Bearer <JWT>
```

Example:

``` http
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

------------------------------------------------------------------------

# 13. JWT Middleware

The middleware:

1.  Reads the `Authorization` header.
2.  Checks for `Bearer`.
3.  Extracts the token.
4.  Verifies the JWT.
5.  Extracts `user_id`.
6.  Places the decoded payload into `req.user`.

Conceptually:

``` text
Authorization Header
        ↓
Bearer JWT
        ↓
jwt.verify()
        ↓
Decoded Payload
        ↓
req.user
        ↓
req.user.user_id
```

This allows the backend to know which application user is making the
request.

------------------------------------------------------------------------

# 14. Why GitHub OAuth Is Needed

Normal registration only creates:

``` text
GitHub Monitor User
    ↓
MongoDB _id
    ↓
JWT
```

It does not automatically provide:

``` text
GitHub ID
GitHub username
GitHub access token
GitHub API access
```

Therefore an existing email/password user needs:

``` text
Register
   ↓
Application account
   ↓
Connect GitHub
   ↓
GitHub OAuth
   ↓
GitHub identity attached
```

------------------------------------------------------------------------

# 15. Connect GitHub vs Continue with GitHub

This distinction is extremely important.

## Connect GitHub

The user is already logged into GitHub Monitor.

``` text
Existing Application User
        ↓
Existing JWT
        ↓
Connect GitHub
        ↓
GitHub OAuth
        ↓
Attach GitHub account
```

Endpoint:

``` http
GET /api/auth/github/start
```

This endpoint requires the application's JWT.

------------------------------------------------------------------------

## Continue with GitHub

The user is not logged into GitHub Monitor yet.

``` text
Login Page
    ↓
Continue with GitHub
    ↓
GitHub OAuth
    ↓
GitHub identity
    ↓
Find/Create application user
    ↓
Application JWT
    ↓
Dashboard
```

Endpoint:

``` http
GET /api/auth/github/login
```

This endpoint does **not** require an application JWT.

------------------------------------------------------------------------

# 16. Connect GitHub Architecture

The Connect GitHub endpoint is protected:

``` text
GET /api/auth/github/start
        ↓
JWT Middleware
        ↓
Verify JWT
        ↓
Get req.user.user_id
        ↓
Start GitHub OAuth
```

The backend knows exactly which application user should receive the
GitHub account.

------------------------------------------------------------------------

# 17. Connect GitHub Flow

``` mermaid
sequenceDiagram
    participant U as User
    participant F as React
    participant B as Backend
    participant G as GitHub
    participant DB as MongoDB

    U->>F: Click Connect GitHub
    F->>B: GET /api/auth/github/start
    Note over F,B: Authorization: Bearer JWT

    B->>B: Verify JWT
    B->>B: Extract user_id
    B->>B: Generate OAuth state
    B-->>F: Set HttpOnly OAuth cookies
    B-->>F: Return GitHub OAuth URL

    F->>G: Redirect to GitHub
    G->>U: Show authorization page
    U->>G: Authorize

    G->>B: /github/callback?code&state

    B->>B: Verify state
    B->>B: Get application user ID

    B->>G: Exchange code
    G-->>B: GitHub access token

    B->>G: GET /user
    G-->>B: GitHub user

    B->>G: GET /user/emails
    G-->>B: GitHub email

    B->>DB: Check githubId
    DB-->>B: Check connection

    B->>DB: Update existing application user
    DB-->>B: User updated

    B->>B: Clear temporary OAuth cookies
    B-->>F: Redirect /dashboard
```

------------------------------------------------------------------------

# 18. Starting Connect GitHub OAuth

The frontend already has the application JWT in:

``` text
localStorage
```

However, doing:

``` js
window.location.href =
    "http://localhost:5000/api/auth/github/start";
```

does not automatically attach:

``` http
Authorization: Bearer <JWT>
```

Therefore the frontend first makes an authenticated request:

``` http
GET /api/auth/github/start
Authorization: Bearer <JWT>
```

The backend then returns the GitHub OAuth URL.

The frontend redirects the browser to that URL.

------------------------------------------------------------------------

# 19. OAuth State

OAuth `state` is a temporary random value.

Example:

``` text
8f91c7d1e3a64b9c4f...
```

It is generated using:

``` js
crypto.randomBytes(32).toString("hex");
```

The state is not:

``` text
JWT
```

and it is not:

``` text
GitHub access token
```

It exists to validate the OAuth transaction.

------------------------------------------------------------------------

# 20. Why State Exists

The flow is:

``` text
Backend
   ↓
Generate random state
   ↓
Store state
   ↓
Send state to GitHub
   ↓
GitHub authorization
   ↓
GitHub returns state
   ↓
Compare states
```

If:

``` text
Original State == Returned State
```

continue.

If:

``` text
Original State != Returned State
```

reject the OAuth request.

``` mermaid
flowchart TD
    A[Generate State] --> B[Store State]
    B --> C[Send State to GitHub]
    C --> D[GitHub Authorization]
    D --> E[GitHub Callback]
    E --> F[Read Returned State]
    F --> G{State Matches?}
    G -->|Yes| H[Continue OAuth]
    G -->|No| I[Reject OAuth]
```

------------------------------------------------------------------------

# 21. OAuth HttpOnly Cookies

The current Connect GitHub flow temporarily stores OAuth information in
HttpOnly cookies.

For example:

``` text
github_oauth_state
github_oauth_user
```

Example:

``` js
res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/"
});
```

The user ID is stored temporarily so the callback can know which
application user started the OAuth connection.

The two values have different purposes:

``` text
github_oauth_state
    ↓
Validates the OAuth transaction

github_oauth_user
    ↓
Identifies the application user
```

A more advanced production implementation can store:

``` text
state → userId
```

server-side instead of putting the user ID directly into a cookie.

------------------------------------------------------------------------

# 22. Continue with GitHub

The Login page can also contain:

``` text
[ Continue with GitHub ]
```

This is a completely different OAuth flow from Connect GitHub.

The user is not authenticated with GitHub Monitor yet.

Therefore this route must not use the normal JWT middleware:

``` http
GET /api/auth/github/login
```

The backend starts OAuth without requiring an application JWT.

------------------------------------------------------------------------

# 23. Continue with GitHub Flow

``` mermaid
sequenceDiagram
    participant U as User
    participant F as React
    participant B as Backend
    participant G as GitHub
    participant DB as MongoDB

    U->>F: Click Continue with GitHub
    F->>B: GET /api/auth/github/login

    B->>B: Generate OAuth state
    B-->>F: Set OAuth state cookie
    B-->>F: Return GitHub OAuth URL

    F->>G: Redirect to GitHub
    G->>U: Show GitHub authorization
    U->>G: Authorize

    G->>B: /github/login/callback?code&state

    B->>B: Verify OAuth state

    B->>G: Exchange code
    G-->>B: GitHub access token

    B->>G: GET /user
    G-->>B: GitHub user

    B->>G: GET /user/emails
    G-->>B: GitHub email

    B->>DB: Find user by githubId

    alt User exists
        DB-->>B: Existing user
    else User does not exist
        B->>DB: Create new user
        DB-->>B: New user
    end

    B->>B: Generate Application JWT
    B-->>F: Redirect to dashboard
    F->>F: Store application JWT
```

------------------------------------------------------------------------

# 24. Why Continue with GitHub Does Not Need the Application JWT

With normal login:

``` text
Email + Password
        ↓
Find application user
        ↓
Generate JWT
```

With GitHub login:

``` text
GitHub authorization
        ↓
GitHub user ID
        ↓
Find application user
        ↓
Generate JWT
```

There is no application JWT at the beginning because the user is trying
to obtain one.

Therefore:

``` text
Connect GitHub
    → JWT required

Continue with GitHub
    → JWT not required
```

------------------------------------------------------------------------

# 25. Finding the User During GitHub Login

After GitHub returns the user information:

``` json
{
    "id": 123456789,
    "login": "sathish-dev",
    "avatar_url": "...",
    "html_url": "..."
}
```

the backend searches:

``` js
User.findOne({
    githubId: githubUser.id
});
```

There are two possibilities.

## Existing GitHub user

``` text
githubId found
    ↓
Existing application user
    ↓
Generate JWT
    ↓
Dashboard
```

## New GitHub user

``` text
githubId not found
    ↓
Create application user
    ↓
Store GitHub identity
    ↓
Generate JWT
    ↓
Dashboard
```

This allows GitHub Monitor to support first-time GitHub users.

------------------------------------------------------------------------

# 26. GitHub Login User Creation

For a GitHub-only user, there may be no application password.

Conceptually:

``` js
{
    username: "App Username",
    email: "github@email.com",

    githubId: 123456789,
    githubUsername: "github-user",
    githubEmail: "github@email.com",

    githubAccessToken: "...",
    avatarUrl: "...",
    profileUrl: "..."
}
```

The `password` field can remain absent because the user authenticated
through GitHub.

The exact username-generation or conflict-handling strategy should be
implemented by the backend.

------------------------------------------------------------------------

# 27. GitHub Authorization

GitHub handles GitHub authentication.

The user may see:

``` text
GitHub

GitHub Monitor wants access to your account

[ Authorize ]
```

The GitHub password is never sent to GitHub Monitor.

GitHub handles the actual authentication.

------------------------------------------------------------------------

# 28. Authorization Code

After successful authorization, GitHub redirects to the callback:

``` text
/api/auth/github/callback
```

with:

``` text
code
state
```

Example:

``` text
/api/auth/github/callback
    ?code=abc123
    &state=8f91c7d1...
```

The `code` is temporary.

It is not the GitHub access token.

------------------------------------------------------------------------

# 29. Authorization Code Exchange

The backend sends the authorization code to GitHub:

``` http
POST https://github.com/login/oauth/access_token
```

The backend uses:

``` text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
code
```

GitHub responds with:

``` text
GitHub Access Token
```

The GitHub client secret must remain on the backend.

It must never be placed in React.

------------------------------------------------------------------------

# 30. GitHub Service

The GitHub service handles communication with GitHub.

Conceptually:

``` text
Auth Controller
      |
      +-- getGithubAccessToken(code)
      |
      +-- getGithubUser(accessToken)
      |
      +-- getGithubEmail(accessToken)
      |
      ↓
GitHub API
```

This keeps GitHub API logic separate from the authentication controller.

------------------------------------------------------------------------

# 31. Getting GitHub User

The backend calls:

``` http
GET https://api.github.com/user
```

with:

``` http
Authorization: Bearer <github-access-token>
```

GitHub returns information such as:

``` json
{
    "id": 123456789,
    "login": "sathish-dev",
    "avatar_url": "...",
    "html_url": "..."
}
```

Important fields:

``` text
id
login
avatar_url
html_url
```

------------------------------------------------------------------------

# 32. Getting GitHub Email

The `/user` endpoint may not always provide the email.

Therefore the backend also calls:

``` http
GET https://api.github.com/user/emails
```

The backend searches for:

``` text
primary = true
verified = true
```

and stores the primary verified email.

------------------------------------------------------------------------

# 33. GitHub ID

The GitHub ID is the stable identity of the GitHub account.

Example:

``` text
githubId = 123456789
```

The GitHub username:

``` text
githubUsername = "sathish-dev"
```

is mainly useful for display.

Therefore:

``` text
githubId
    ↓
Identity

githubUsername
    ↓
Display
```

------------------------------------------------------------------------

# 34. Associating GitHub With an Existing User

For Connect GitHub, the backend already knows:

``` text
userId = ABC123
```

from the authenticated application user.

After GitHub OAuth it knows:

``` text
githubId = 123456789
githubUsername = sathish-dev
```

It updates the existing user:

``` js
await User.findByIdAndUpdate(userId, {
    githubId: githubUser.id,
    githubUsername: githubUser.login,
    githubEmail,
    githubAccessToken,
    avatarUrl: githubUser.avatar_url,
    profileUrl: githubUser.html_url
});
```

This is the actual account association.

------------------------------------------------------------------------

# 35. Association Diagram

``` mermaid
flowchart LR
    A[Application User]
    B[MongoDB _id]
    C[User Document]

    D[GitHub Account]
    E[githubId]
    F[githubUsername]
    G[GitHub Access Token]

    A --> B
    B --> C

    D --> E
    D --> F
    D --> G

    E --> C
    F --> C
    G --> C
```

The result is:

``` text
Application User
        |
        +-- username
        +-- email
        +-- password
        |
        +-- GitHub Account
                |
                +-- githubId
                +-- githubUsername
                +-- githubEmail
                +-- githubAccessToken
```

------------------------------------------------------------------------

# 36. Preventing Duplicate GitHub Connections

Before connecting GitHub, the backend checks:

``` js
User.findOne({
    githubId: githubUser.id
});
```

Suppose:

``` text
User A
githubId = 123456789
```

and User B tries to connect the same GitHub account.

The backend detects:

``` text
githubId already belongs to another user
```

and rejects the connection.

``` text
GitHub account already connected
        ↓
Reject connection
```

This protects the relationship:

``` text
One GitHub account
        ↓
One GitHub Monitor user
```

------------------------------------------------------------------------

# 37. Connect GitHub vs Continue with GitHub --- Full Comparison

  Feature                             Connect GitHub     Continue with GitHub
  ----------------------------------- ------------------ ----------------------
  User already logged in?             Yes                No
  Application JWT required?           Yes                No
  Purpose                             Attach GitHub      Login/signup
  Start endpoint                      `/github/start`    `/github/login`
  Existing user known before OAuth?   Yes                No
  Identify app user                   JWT → `user_id`    GitHub `githubId`
  Creates application user?           No                 Possibly
  Generates application JWT?          Already has one    Yes
  Result                              GitHub connected   User logged in

This separation is important because the two endpoints solve different
problems.

------------------------------------------------------------------------

# 38. Three Important Values

There are three different security values.

## Application JWT

``` text
YOUR JWT
```

Purpose:

``` text
Identify the GitHub Monitor user
```

Storage currently:

``` text
localStorage
```

Used for:

``` text
Frontend → Backend authentication
```

------------------------------------------------------------------------

## OAuth State

``` text
Random temporary value
```

Purpose:

``` text
Validate the OAuth transaction
```

Storage currently:

``` text
HttpOnly cookie
```

Used only during OAuth.

------------------------------------------------------------------------

## GitHub Access Token

``` text
GitHub access token
```

Purpose:

``` text
Allow backend to call GitHub APIs
```

Storage:

``` text
MongoDB
```

The GitHub access token should not be exposed to React unnecessarily.

------------------------------------------------------------------------

# 39. Token Relationship

``` mermaid
flowchart TD
    A[Application JWT]
    B[OAuth State]
    C[GitHub Access Token]

    A --> D[Identify Application User]
    B --> E[Validate OAuth Transaction]
    C --> F[Access GitHub API]

    D --> G[GitHub Monitor]
    E --> G
    F --> G
```

These values have completely different purposes.

------------------------------------------------------------------------

# 40. Why GitHub ID Is Not the Application User ID

GitHub gives:

``` text
githubId = 123456789
```

GitHub Monitor has its own MongoDB ID:

``` text
_id = 65abc123...
```

They should remain separate.

``` text
GitHub Monitor
    _id
      ↓
Application identity

GitHub
    githubId
      ↓
GitHub identity
```

This allows the application to maintain its own users independently of
GitHub.

------------------------------------------------------------------------

# 41. Normal Email Login

Normal login still uses:

``` text
Email
Password
```

The GitHub connection does not replace application authentication.

``` mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    F->>B: POST /api/auth/login
    B->>DB: Find user by email
    DB-->>B: User
    B->>B: bcrypt.compare()
    B->>B: Generate JWT
    B-->>F: JWT + user
    F->>F: Store JWT
    F->>F: Dashboard
```

If the user already has a GitHub connection, that information remains
attached to the same MongoDB document.

------------------------------------------------------------------------

# 42. Continue with GitHub Login

The GitHub login flow is:

``` text
Login Page
    ↓
Continue with GitHub
    ↓
GET /api/auth/github/login
    ↓
Generate OAuth state
    ↓
GitHub
    ↓
User authorizes
    ↓
GitHub callback
    ↓
Verify state
    ↓
Exchange code
    ↓
Get GitHub user
    ↓
Find by githubId
    ↓
Create user if needed
    ↓
Generate application JWT
    ↓
Dashboard
```

The important point is:

``` text
GitHub OAuth authenticates the user
        ↓
Your backend creates your application's JWT
        ↓
Your application continues using YOUR JWT
```

GitHub does not become your application's session token.

------------------------------------------------------------------------

# 43. Future Dashboard Requests

Once authenticated, the frontend sends the application JWT.

Example:

``` http
GET /api/repositories
Authorization: Bearer <application-jwt>
```

The backend:

``` text
JWT
 ↓
JWT Middleware
 ↓
user_id
 ↓
MongoDB
 ↓
GitHub access token
 ↓
GitHub API
 ↓
Repositories
```

------------------------------------------------------------------------

# 44. Dashboard Architecture

``` mermaid
flowchart TD
    A[React Dashboard]
    A --> B[Backend API]
    B --> C[JWT Middleware]
    C --> D[Application User ID]
    D --> E[(MongoDB)]
    E --> F[GitHub Access Token]
    F --> G[GitHub API]

    G --> H[Repositories]
    G --> I[GitHub Events]
    G --> J[Pull Requests]
    G --> K[Issues]

    H --> A
    I --> A
    J --> A
    K --> A
```

The browser authenticates with your backend using the application JWT.

The backend communicates with GitHub using the GitHub access token.

------------------------------------------------------------------------

# 45. Security Boundaries

``` text
                     Browser
                        |
              +---------+---------+
              |                   |
          React App          localStorage
              |                   |
              |                  JWT
              ↓
           Backend
              |
       +------+------+
       |             |
   JWT Secret    GitHub Secret
       |             |
       ↓             ↓
   JWT Auth      GitHub OAuth
                     |
                     ↓
                   GitHub
```

Important rules:

``` text
JWT_SECRET_KEY
    → Backend only

GITHUB_CLIENT_SECRET
    → Backend only

GitHub Access Token
    → Backend only when possible

OAuth State
    → Temporary HttpOnly cookie
```

------------------------------------------------------------------------

# 46. Environment Variables

``` env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

FRONTEND_URL=http://localhost:5173

JWT_SECRET_KEY=...
```

## GITHUB_CLIENT_ID

Identifies the GitHub OAuth application.

## GITHUB_CLIENT_SECRET

Secret used by the backend when exchanging the authorization code.

Never expose it to React.

## GITHUB_CALLBACK_URL

The callback endpoint registered in the GitHub OAuth application.

## FRONTEND_URL

Used when the backend redirects the user back to React.

## JWT_SECRET_KEY

Used to sign and verify the application's JWT.

------------------------------------------------------------------------

# 47. Authentication Routes

The architecture should keep the routes separated by purpose:

``` text
POST /api/auth/register
    ↓
Create application account

POST /api/auth/login
    ↓
Email/password login

GET /api/auth/github/start
    ↓
Connect GitHub to existing logged-in user
    ↓
JWT required

GET /api/auth/github/callback
    ↓
Complete Connect GitHub OAuth

GET /api/auth/github/login
    ↓
Continue with GitHub
    ↓
JWT not required

GET /api/auth/github/login/callback
    ↓
Complete GitHub login
```

The exact callback route names can be changed, but the two OAuth flows
should remain logically separate.

------------------------------------------------------------------------

# 48. Error Cases

## Missing OAuth Code

``` text
GitHub callback
    ↓
No code
    ↓
OAuth failed
```

Redirect:

``` text
/connect-github?error=oauth_failed
```

or the corresponding login error page for GitHub login.

------------------------------------------------------------------------

## Invalid State

``` text
Returned state != Saved state
```

Then:

``` text
Reject OAuth
```

Redirect:

``` text
/connect-github?error=invalid_state
```

------------------------------------------------------------------------

## Missing OAuth Session

If temporary OAuth information is missing:

``` text
OAuth session expired
```

Redirect:

``` text
/login?error=session_expired
```

------------------------------------------------------------------------

## GitHub Already Connected

If the GitHub ID belongs to another application user:

``` text
Reject connection
```

Redirect:

``` text
/connect-github?error=github_already_connected
```

------------------------------------------------------------------------

# 49. Clearing OAuth Cookies

OAuth cookies are temporary.

After successful OAuth:

``` js
res.clearCookie("github_oauth_state");
res.clearCookie("github_oauth_user");
```

The lifecycle is:

``` text
Start OAuth
    ↓
Create temporary cookies
    ↓
GitHub authorization
    ↓
Callback
    ↓
Verify
    ↓
Update user
    ↓
Delete temporary cookies
```

The OAuth cookies are not the application's long-term authentication
session.

------------------------------------------------------------------------

# 50. Final Redirect

After successfully connecting GitHub:

``` text
http://localhost:5173/dashboard
```

After successful GitHub login:

``` text
http://localhost:5173/dashboard
```

The difference is what happened before the dashboard.

``` text
Connect GitHub
    ↓
Existing JWT
    ↓
Attach GitHub
    ↓
Dashboard
```

versus:

``` text
Continue with GitHub
    ↓
GitHub identifies user
    ↓
Generate JWT
    ↓
Dashboard
```

------------------------------------------------------------------------

# 51. Complete Register + Connect Flow

``` mermaid
sequenceDiagram
    participant U as User
    participant F as React
    participant B as Backend
    participant DB as MongoDB
    participant G as GitHub

    Note over U,G: Step 1 - Application Registration

    U->>F: Enter username/email/password
    F->>B: POST /api/auth/register
    B->>DB: Check email
    DB-->>B: User not found
    B->>B: Hash password
    B->>DB: Create user
    B->>B: Generate JWT
    B-->>F: JWT
    F->>F: Store JWT
    F->>F: Navigate /connect-github

    Note over U,G: Step 2 - Connect Existing User

    U->>F: Click Connect GitHub
    F->>B: GET /api/auth/github/start
    Note over F,B: Authorization: Bearer JWT

    B->>B: Verify JWT
    B->>B: Get user_id
    B->>B: Generate OAuth state
    B->>F: Set HttpOnly OAuth cookies
    B-->>F: GitHub OAuth URL

    F->>G: Redirect to GitHub
    G->>U: Authorization page
    U->>G: Authorize

    G->>B: callback?code&state

    B->>B: Verify state
    B->>G: Exchange code
    G-->>B: GitHub access token

    B->>G: GET /user
    G-->>B: GitHub identity

    B->>G: GET /user/emails
    G-->>B: GitHub email

    B->>DB: Check githubId
    B->>DB: Update existing user

    B->>B: Clear OAuth cookies
    B-->>F: Redirect /dashboard
```

------------------------------------------------------------------------

# 52. Complete Continue-with-GitHub Flow

``` mermaid
sequenceDiagram
    participant U as User
    participant F as React
    participant B as Backend
    participant G as GitHub
    participant DB as MongoDB

    U->>F: Click Continue with GitHub

    F->>B: GET /api/auth/github/login

    B->>B: Generate OAuth state
    B->>F: Set temporary OAuth cookie
    B-->>F: GitHub OAuth URL

    F->>G: Redirect to GitHub
    G->>U: Authorization page
    U->>G: Authorize

    G->>B: /github/login/callback?code&state

    B->>B: Verify OAuth state

    B->>G: Exchange authorization code
    G-->>B: GitHub access token

    B->>G: GET /user
    G-->>B: GitHub user

    B->>G: GET /user/emails
    G-->>B: GitHub email

    B->>DB: Find user by githubId

    alt Existing user
        DB-->>B: Existing application user
    else New user
        B->>DB: Create application user
        DB-->>B: New user
    end

    B->>B: Generate application JWT
    B->>B: Clear OAuth cookie
    B-->>F: Redirect /dashboard

    F->>F: Store application JWT
```

------------------------------------------------------------------------

# 53. Complete Authentication Decision Tree

``` mermaid
flowchart TD

    A[User Opens Application]

    A --> B{How does user want to authenticate?}

    B -->|Register| C[Email + Password]
    C --> D[Create Application User]
    D --> E[Generate JWT]
    E --> F[Connect GitHub]
    F --> G[GitHub OAuth]
    G --> H[Attach GitHub Identity]
    H --> I[Dashboard]

    B -->|Email Login| J[Email + Password]
    J --> K[Verify Credentials]
    K --> L[Generate JWT]
    L --> I

    B -->|Continue with GitHub| M[GitHub OAuth]
    M --> N[Get GitHub Identity]
    N --> O{githubId exists?}
    O -->|Yes| P[Existing Application User]
    O -->|No| Q[Create Application User]
    P --> R[Generate JWT]
    Q --> R
    R --> I

    B -->|Connect GitHub| S[Existing JWT]
    S --> T[GitHub OAuth]
    T --> U[Attach GitHub Identity]
    U --> I
```

------------------------------------------------------------------------

# 54. Most Important Architectural Concept

The most important distinction is:

``` text
REGISTRATION
    ↓
Creates a GitHub Monitor account

EMAIL LOGIN
    ↓
Authenticates an existing GitHub Monitor account

CONTINUE WITH GITHUB
    ↓
Uses GitHub to authenticate into GitHub Monitor

CONNECT GITHUB
    ↓
Connects a GitHub account to an already authenticated
GitHub Monitor account
```

These are four different operations.

------------------------------------------------------------------------

# 55. Identity Relationship

The application owns:

``` text
MongoDB _id
username
email
password
```

GitHub owns:

``` text
githubId
githubUsername
githubEmail
```

The association is stored in the application database:

``` text
                    MongoDB User
                         |
             +-----------+-----------+
             |                       |
       Application Identity    GitHub Identity
             |                       |
          _id                    githubId
          username              githubUsername
          email                 githubEmail
          password              githubEmail
```

The OAuth process creates the connection between these identities.

------------------------------------------------------------------------

# 56. Final Architecture Summary

``` text
                     GITHUB MONITOR
                           |
        +------------------+------------------+
        |                  |                  |
     Register          Email Login       GitHub Login
        |                  |                  |
        ↓                  ↓                  ↓
  Create User       Verify Password     GitHub OAuth
        |                  |                  |
        ↓                  ↓                  ↓
      JWT                JWT           Find/Create User
        |                  |                  |
        +------------------+------------------+
                           |
                      Application JWT
                           |
                     GitHub Monitor
                           |
                    Connect GitHub
                           |
                      JWT Middleware
                           |
                      Identify User
                           |
                     Generate State
                           |
                    HttpOnly Cookie
                           |
                       GitHub OAuth
                           |
                    User Authorizes
                           |
                       Code + State
                           |
                    Verify OAuth State
                           |
                     Exchange Code
                           |
                  GitHub Access Token
                           |
                     GitHub API
                           |
              +------------+------------+
              |            |            |
           githubId   githubUsername  githubEmail
              |            |            |
              +------------+------------+
                           |
                  Update User Document
                           |
                        MongoDB
                           |
                       Dashboard
```

The overall architecture can be summarized as:

``` text
Application Authentication
        +
GitHub Authentication
        ↓
One MongoDB User
        ↓
Application JWT
        ↓
Authenticated GitHub Monitor API
        ↓
GitHub Access Token
        ↓
GitHub API
```

The **Application JWT answers "Who are you in GitHub Monitor?"**

The **GitHub OAuth process answers "Which GitHub account are you
connecting or using to log in?"**

The **GitHub access token answers "What GitHub resources can the backend
access?"**

Keeping these three concepts separate makes the authentication
architecture easier to understand, maintain and extend.
