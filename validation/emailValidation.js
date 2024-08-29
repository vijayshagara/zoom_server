const Joi = require("joi");

const loginUuid = Joi.object().keys({
  topic:  Joi.string().required(),
  type:  Joi.number().required(),
  start_time: Joi.string().required(),
  duration:Joi.number().required(),
  email: Joi.array().required(),
  agenda:Joi.string().required(),
});

module.exports = {
  loginUuid,
};
