# Github Monitor 

This is the project that is used to monitor the activities of the repository

Here we use the __**Webhook**__ from the github and call our api using the connection and get the body from the github

> Note: Webhook is used to get the events automatically; if any changes occur in github repository the webhook will automatically redeliver the hook

***

# My initial plan setup 

First get the ++ using the post method and normalize the body 

## The Github WebHook Body contains something like
```
{
  ref: "refs/heads/testbranch",
  before: "...",
  after: "...",
  repository: {...},
  pusher: {...},
  commits: [...],
  head_commit: {...}
}
```

### The main Things we need to take from the Body 

Each objects and Members in the Json contains specific Details

| Member | Responsibility |
|:---    |    :----:      |
| **Repository** | Contains the Details about the repository Like owner and Login etc..,|
| **Before and After**| Contains the commit id for the before and after of the push or pull|
| **Pusher** | Contains the details of the pusher  (Name and Email)|
| **Commits** | It is an array that contains all of the Commit details Like id of the commit and Commit message|
| **Head_Commit** | It contains the details of the commit like modified files, commiter details, author details| 



