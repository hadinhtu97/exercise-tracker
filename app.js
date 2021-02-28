require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Read README to use api.'));

//create schemas and models
const dbErr = { error: "Server database error happened, please try angain later" };
const userSchema = new mongoose.Schema({
    username: String
})
const User = mongoose.model('User', userSchema);
const exerciseSchema = new mongoose.Schema({
    userId: String,
    description: String,
    duration: Number,
    date: String
})
const Exercise = mongoose.model('Excerise', exerciseSchema);

let convertDate = (dateString) => {
    dateString = dateString.slice(0, dateString.length - 13);
    dateString = dateString.split(",").join('');
    dateString = dateString.replace(/(\w+)\s(\w+)\s(\w+)\s(\w+)/, "$1 $3 $2 $4")
    return dateString;
}

//post new user
app.post('/api/exercise/new-user', (req, res) => {
    User.find({ username: req.body.username }, (err, data) => {
        if (err) {
            res.json(dbErr);
            return console.log(err);
        } else {
            if (data.length == 0) {
                let user = new User({ username: req.body.username });
                user.save((err, data) => {
                    if (err) {
                        res.json(dbErr);
                        return console.log(err);
                    } else {
                        res.json(data);
                    }
                })
            } else {
                res.json("Username already taken");
            }
        }
    })
})

//get all user
app.get('/api/exercise/users', (req, res) => {
    User.find({}, (err, data) => {
        if (err) {
            res.send(dbErr);
            return console.log(err);
        } else {
            res.json(data);
        }
    })
})

//post exercise to user
app.post('/api/exercise/add', (req, res) => {
    User.find({ _id: req.body.userId }, (err, data) => {
        if (err) {
            res.send(dbErr);
            return console.log(err);
        } else {
            if (data.length == 0) {
                res.json("Cannot find user with id: " + req.body.userId);
            } else {
                let exercise = new Exercise({
                    userId: req.body.userId,
                    description: req.body.description,
                    duration: req.body.duration,
                    date: req.body.date == '' ? new Date().toUTCString() : new Date(req.body.date).toUTCString()
                })
                exercise.save((err, ex) => {
                    if (err) {
                        res.json(dbErr);
                        return console.log(err);
                    } else {
                        res.json({
                            _id: ex.userId,
                            username: data[0].username,
                            description: ex.description,
                            duration: ex.duration,
                            date: convertDate(ex.date)
                        })
                    }
                })
            }
        }
    })
})

//get log of user
app.get('/api/exercise/log', (req, res) => {
    if (req.query.userId == undefined) {
        res.json('Unknow UserId')
    } else {
        User.find({ _id: req.query.userId }, (err, users) => {
            if (err) {
                res.json(dbErr);
                return console.log(err);
            } else {
                if (users.length == 0) {
                    res.json("Cannot find user with id: " + req.query.userId);
                } else {
                    let limit = req.query.limit === undefined ? false : parseInt(req.query.limit);
                    Exercise.find({ userId: req.query.userId }).limit(limit).exec((err, exercises) => {
                        if (err) {
                            res.json(dbErr);
                            return console.log(err);
                        } else {
                            if (req.query.from == undefined || req.query.to == undefined) {
                                let listEx = [];
                                if (exercises.length != 0) {
                                    exercises.forEach(ex => {
                                        listEx.push({
                                            description: ex.description,
                                            duration: ex.duration,
                                            date: convertDate(ex.date)
                                        })
                                    })
                                }
                                res.json({
                                    _id: users[0]._id,
                                    username: users[0].username,
                                    count: listEx.length,
                                    log: listEx
                                })
                            } else {
                                let fromDate = new Date(req.query.from);
                                let toDate = new Date(req.query.to);
                                let listEx = [];
                                if (exercises != 0) {
                                    exercises.filter(ex => new Date(ex.date) > fromDate && new Date(ex.date) < toDate).forEach(ex => {
                                        listEx.push({
                                            description: ex.description,
                                            duration: ex.duration,
                                            date: convertDate(ex.date)
                                        })
                                    })
                                }
                                res.json({
                                    _id: users[0]._id,
                                    username: users[0].username,
                                    from: convertDate(fromDate.toUTCString()),
                                    to: convertDate(toDate.toUTCString()),
                                    count: listEx.length,
                                    log: listEx
                                })
                            }
                        }
                    })
                }
            }
        })
    }
})



app.listen(port, () => {
    console.log('Your app is listening on port ' + port);
})