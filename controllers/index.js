"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const libs = {};


fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))
        libs[file.slice(0,-3)] = model;
    });
module.exports = libs;