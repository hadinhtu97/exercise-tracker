require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.sendFile(__dirname + "/views/index.html"));
app.use(express.static(__dirname + "/public"));

//create schemas and models
const dbErr = { error: "Some error happened, please try angain later" };
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
                    date: req.body.date == '' ? moment().format('LL') : moment(req.body.date).format('LL')
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
                            date: ex.date
                        })
                    }
                })
            }
        }
    })
})





app.listen(port, () => {
    console.log('Your app is listening on port ' + port);
})