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

app.get('/', (req, res) => res.sendFile(__dirname + "/views/index.html"));
app.use(express.static(__dirname + "/public"));

const dbErr = { error: "Some error happened, please try angain later" };
const userSchema = new mongoose.Schema({
    username: String
})
const User = mongoose.model('User', userSchema);
const exerciseSchema = new mongoose.Schema({
    userId: String,
    description: String,
    duration: Number,
    date: Date
})
const Exercise = mongoose.model('Excerise', exerciseSchema);









app.listen(port, () => {
    console.log('Your app is listening on port ' + port);
})