# GitHub Monitor - MongoDB Schema Design

## 1. Users

The `users` collection represents **who performed an activity**.

| Column | Type | Key | Meaning |
|---|---|---|---|
| `_id` | ObjectId | PK | MongoDB internal ID |
| `githubId` | Number | UNIQUE | GitHub's user ID |
| `username` | String | | GitHub username |
| `avatarUrl` | String | | User profile image |
| `profileUrl` | String | | GitHub profile URL |
| `createdAt` | Date | | When we stored the user |
| `updatedAt` | Date | | Last update |

### Example

```text
_id:        68abc123
githubId:   218540256
username:   ragul023
avatarUrl:  ...
profileUrl: https://github.com/ragul023
```
## Repository

| Column          | Type     | Key    | Meaning                       |
| --------------- | -------- | ------ | ----------------------------- |
| `_id`           | ObjectId | PK     | MongoDB internal ID           |
| `githubId`      | Number   | UNIQUE | GitHub repository ID          |
| `name`          | String   |        | Repository name               |
| `fullName`      | String   | UNIQUE | `owner/repository`            |
| `ownerGithubId` | Number   |        | GitHub ID of repository owner |
| `ownerUsername` | String   |        | Repository owner              |
| `defaultBranch` | String   |        | Default branch                |
| `private`       | Boolean  |        | Whether repository is private |
| `visibility`    | String   |        | public/private                |
| `language`      | String   |        | Main repository language      |
| `url`           | String   |        | GitHub API URL                |
| `htmlUrl`       | String   |        | Repository web URL            |
| `createdAt`     | Date     |        | Our record creation           |
| `updatedAt`     | Date     |        | Our record update             |


```
_id:             68xyz456
githubId:        1343339558
name:            githubmonitor
fullName:        ragul023/githubmonitor
ownerGithubId:   218540256
ownerUsername:   ragul023
defaultBranch:   main
private:         false
visibility:      public
language:        Java

```

## Events Model

| Column          | Type     | Key    | Meaning                                |
| --------------- | -------- | ------ | -------------------------------------- |
| `_id`           | ObjectId | PK     | Event ID                               |
| `deliveryId`    | String   | UNIQUE | GitHub webhook delivery ID             |
| `eventType`     | String   | INDEX  | `push`, `pull_request`, `issues`, etc. |
| `repositoryId`  | ObjectId | FK     | Which repository                       |
| `actorId`       | ObjectId | FK     | Who performed it                       |
| `ref`           | String   |        | Git reference                          |
| `branch`        | String   | INDEX  | Branch involved                        |
| `beforeSha`     | String   |        | Previous commit SHA                    |
| `afterSha`      | String   |        | New commit SHA                         |
| `forced`        | Boolean  |        | Whether push was forced                |
| `created`       | Boolean  |        | Whether branch/tag was created         |
| `deleted`       | Boolean  |        | Whether branch/tag was deleted         |
| `compareUrl`    | String   |        | GitHub comparison URL                  |
| `commitCount`   | Number   |        | Number of commits in push              |
| `headCommitSha` | String   |        | Latest commit                          |
| `status`        | String   |        | Processing status                      |
| `receivedAt`    | Date     |        | When webhook arrived                   |
| `processedAt`   | Date     |        | When processing finished               |
| `createdAt`     | Date     |        | Record creation                        |
| `updatedAt`     | Date     |        | Record update                          |

```
_id:             E1
deliveryId:      abc-123
eventType:       push
repositoryId:    R1
actorId:         U1
ref:             refs/heads/testbranch
branch:          testbranch
beforeSha:       0000000000000000000000000000000000000000
afterSha:        d9b64e4125c43d10256c334dcb4e9a9e80951b63
forced:          false
created:         true
deleted:         false
commitCount:     1
headCommitSha:   d9b64e4125c43d10256c334dcb4e9a9e80951b63
status:          processed
```

## RelationShip

              USERS
          ┌────────────┐
          │ _id        │
          │ githubId   │
          │ username   │
          └─────┬──────┘
                │
                │ actorId
                │
                ▼
          ┌────────────┐
          │   EVENTS   │
          ├────────────┤
          │ _id        │
          │ deliveryId │
          │ eventType  │
          │ actorId    │ ──────► users._id
          │ repositoryId│ ─────► repositories._id
          │ branch     │
          │ beforeSha  │
          │ afterSha   │
          └─────┬──────┘
                │
                │ repositoryId
                ▼
        ┌────────────────┐
        │  REPOSITORIES  │
        ├────────────────┤
        │ _id            │
        │ githubId       │
        │ name           │
        │ fullName       │
        │ defaultBranch  │
        └────────────────┘