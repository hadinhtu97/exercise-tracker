# Exercise Tracker

## Description
Backend APIs tracking exercise.

## Use
```
git clone https://github.com/hadinhtu97/exercise-tracker
cd exercise-tracker
npm install
touch .env
[This app use mongodb as database. You need to add a MONGO_URI variable into .env file]
npm run start
```

## APIs
* GET
  * `[]/api/exercise/users`: get an array of all users
  * `[]/api/exercise/log?userId=[id]` : retrieve a full exercise log of any user. You can add `from`, `to` and `limit` parameters to a /api/exercise/log request to retrieve part of the log of any user. `from` and `to` are dates in yyyy-mm-dd format. `limit` is an integer of how many logs to send back.
* POST
  * `[]/api/exercise/new-user`: with form data `username` to create a new user
  * `[]/api/exercise/add`: with form data `userId=_id`, `description`, `duration`, and optionally `date`. If no `date` is supplied, the current date will be used.

### Demo
[Link Demo](https://exercise-tracker.hadinhtu97.repl.co/)
