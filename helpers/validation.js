const Joi = require('joi');

const userValidate = data  => {
  const schema = Joi.object({
    email: Joi.string().pattern(new RegExp('gmail.com$')).lowercase().email().required(),
    password: Joi.string().min(4).max(32).required(),
  });
  return schema.validate(data);
}

module.exports = userValidate;
