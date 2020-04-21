const Joi = require('joi');
// const PostalAddressDB = require('../postal-address').models.PostalAddressDB;

module.exports = {
  db: (sequelize, Sequelize) => {
    const Account = sequelize.define('Account', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      displayName: Sequelize.STRING,
      externalId: Sequelize.STRING,
    });

    return Account;
  },
  id: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
  api: Joi.object().keys({
    displayName: Joi.string().required(),
  }),
  apiPatch: Joi.object().keys({
    displayName: Joi.string()
}),

};
