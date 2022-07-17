const authValidation = require("./auth");
const ctrlWrapper = require("./ctrlWrapper");
const { joiValidation, validationFavorite } = require("./joiValidation");
const validation = require("./validation");
const subscribe = require("./subscribeValidation");
const upload = require("./upload");

module.exports = {
  authValidation,
  ctrlWrapper,
  joiValidation,
  validationFavorite,
  validation,
  subscribe,
  upload,
};
