

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

// create the router
let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let allResJSONData = [];

// get home page
router.get("/", resInfo);

// get restaurant with id in url
router.get("/:id", findRestaurant);

// add new restaurant
router.post("/", addRestaurant);

// update existing restaurant info
router.put("/:id", updateRestaurant);

function resInfo(req, res) {
  let allResJSONData = req.app.locals.allResJSONData;
  res.render("restaurants", allResJSONData);
}

function findRestaurant(req, res) {
  let restaurantId = req.params.id;
  let allResJSONData = req.app.locals.allResJSONData;

  allResJSONData.forEach((element) => {
    if (JSON.stringify(element.id) === restaurantId) {
      // send appropriate response form depending on Accept header
      res.format({
        "text/html": () => {
          res.render("restaurant", { restaurant: element });
        },
        "application/json": () => {
          res.status(200).json(element);
        },
      });
    }
  });
}

function addRestaurant(req, res) {
  allResJSONData = req.app.locals.allResJSONData;
  let counter = req.app.locals.counter;

  let addition = req.body;
  let keys = JSON.stringify(Object.keys(addition));
  let values = Object.values(addition);

  // make sure values are valid
  if (
    keys.includes("name") &&
    keys.includes("delivery_fee") &&
    keys.includes("min_order") &&
    !isNaN(values[1]) &&
    !isNaN(values[2])
  ) {
    addition.id = counter;
    addition.menu = {};
    req.app.locals.counter++;
    allResJSONData.push(addition);

    res.status(200).json(addition);
  }
}

function updateRestaurant(req, res) {
  allResJSONData = req.app.locals.allResJSONData;

  let id = req.params.id;
  let counter = req.app.locals.counter;
  let tracker = 0;

  allResJSONData.forEach((element) => {
    if (JSON.stringify(element.id) === id) {
      let values = Object.values(req.body);
      element.name = values[0];
      element.min_order = values[2];
      element.delivery_fee = values[1];
      element.menu = values[3];
      // sending element so I can use the info
      // to render the updated restaurant with
      // get /:id
      res.status(200).json(element);
    } else {
      tracker++;
    }
    if (tracker >= counter) {
      res.status(404);
    }
  });
}
//Export the router object
module.exports = router;
