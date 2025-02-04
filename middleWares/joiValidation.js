const Joi = require("joi");

module.exports = {
  joiValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(6).max(15).required(),
      favorite: Joi.bool(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    next();
  },
  validationFavorite: (req, res, next) => {
    const schema = Joi.object({
      favorite: Joi.bool().required(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    next();
  },
};