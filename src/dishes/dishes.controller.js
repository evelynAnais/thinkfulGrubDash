// const path = require("path");

// Use the existing dishes data
// const dishes = require(path.resolve("src/data/dishes-data"));
const dishes = require("../data/dishes-data");


// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// middleware
function hasRequiredFields(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const requiredFields = ['name', 'description', 'price', 'image_url'];
  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      next({ status: 400, message: `A '${field}' property is required.` });
    }
  }
  next();
}

// middleware
function hasPriceGreaterThanZero(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (price < 0) {
    return res.status(400).json({ error: 'price must be a number greater than zero' });
  }
  next();
}

// middleware
function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) { 
    res.locals.dish = foundDish
    return next();
  }
  next({
    status: 404,
    message: `dish id not found: ${req.params.dishId}`,
  });
}

function list(req, res) {
  res.json({ data: dishes })
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newName = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newName);
  res.status(201).json({ data: newName });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

module.exports = {
  list,
  create: [hasRequiredFields, hasPriceGreaterThanZero, create],
  read: [dishExists, read]
  
}