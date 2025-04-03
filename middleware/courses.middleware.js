const { body } = require("express-validator");

const courseMiddleware = [
  body("name")
    .notEmpty()
    .withMessage("name is require")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("price").notEmpty().withMessage("Price is required"),
];

module.exports = {
  courseMiddleware,
};
