

const express = require("express");
const fs = require("fs");

const app = express();

// this is for the script files for pug
app.use(express.static("public"));

// initialize storage variables
app.locals.allResJSONData = [];
app.locals.counter = 0;
let numOfRestaurants = 0;

// set pug as our template engine
app.set("view engine", "pug");
app.set("views", "./views");

let restaurantsRouter = require("./restaurants-router");
app.use("/restaurants", restaurantsRouter);

// get to home page
app.get("/", (req, res) => {
  res.render("home");
});

// request to add a restaurant
app.get("/addrestaurant", (req, res) => {
  // render the template engine for this page
  res.render("addrestaurant");
});

// read the json files and add info to storage array
fs.readdir("./restaurants", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const jsonData = require("./restaurants/" + file);
      app.locals.allResJSONData.push(jsonData);
      app.locals.counter++;
      numOfRestaurants += 1;
    }
  });

  // listen to clients
  app.listen(2406);
  console.log("Server listening at http://localhost:2406");
});
