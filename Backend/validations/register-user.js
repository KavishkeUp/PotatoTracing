const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .email()
        .min(3)
        .max(100)
        .required(),
    name: Joi.string().min(3).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})


module.exports = schema;