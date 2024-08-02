//basic
require('dotenv').config();
const path = require('path');
const cors = require("cors");

//express config
const express = require('express');
const app = express();

app.use(cors()); //for axios cross url access, so we can respond to fornt end requests
app.use(express.static('public')); //just for a test form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = {app, express};