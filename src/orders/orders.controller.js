const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");
// middleware
function hasRequiredFields(req, res, next) {
  const { data: {deliverTo, mobileNumber, status, dishes: 
    [name, description, image_url, price, quantity] } = {} } = req.body;
  const requiredFields = ['deliverTo', 'mobileNumber', 'status', 'dishes', 
  'name', 'description',  'image_url', 'price', 'quantity'];
  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      next({ status: 400, message: `A '${field}' property is required.` });
    }
  }
  next();
}
// middleware
function validateQuantity(req, res, next) {
  const { data: {deliverTo, mobileNumber, status, dishes: 
    [name, description, image_url, price, quantity] } = {} } = req.body;

  if (typeof quantity !== 'number') {
    return res.status(400).json({ error: 'quantity must be a number' });
  }
  if (quantity < 0) {
    return res.status(400).json({ error: 'quantity must be a number greater than zero' });
  }
  next();
}

function list(req, res) {
  res.json({ data: orders })
}

function create(req, res) {
  const { data: {deliverTo, mobileNumber, status, dishes: 
    [name, description, image_url, price, quantity] } = {} } = req.body;
  const newOrder = {
    deliverTo,
    mobileNumber,
    status,
    dishes:[
      {
        id: nextId,
        name,
        description,
        image_url,
        price,
      }
    ]
  };
  dishes.push(newOrder);
  res.status(201).json({ data: newOrder });
}

module.exports = {
  list,
  create: [hasRequiredFields, validateQuantity, create],
}