require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.sendFile(__dirname + "/views/index.html"));
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
    console.log('Your app is listening on port ' + port);
})