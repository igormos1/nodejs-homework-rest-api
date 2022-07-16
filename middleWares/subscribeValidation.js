const { BadRequest } = require("http-errors");

const subscribe = async (req, res, next) => {
  const { subscription } = req.body;
  if (
    subscription === "starter" ||
    subscription === "pro" ||
    subscription === "business"
  ) {
    next();
  } else {
    throw new BadRequest("Invalid value subscription");
  }
};

module.exports = subscribe;