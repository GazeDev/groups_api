const Joi = require('joi');
// const PostalAddressDB = require('../postal-address').models.PostalAddressDB;

module.exports = {
  db: (sequelize, Sequelize) => {
    const AccountGroup = sequelize.define('AccountGroup', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
    });

    AccountGroup.associate = function (models) {
      models.AccountGroup.hasMany(models.Account, {as: 'AccountId'});
      models.AccountGroup.hasMany(models.Group, {as: 'GroupId'});
    };

    return AccountGroup;
  },
  id: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
  api: Joi.object().keys({
    GroupId: Joi.string().guid(),
    AccountId: Joi.string().guid(),
  }),
  object: Joi.object().keys({
    GroupId: Joi.string().guid(),
    AccountId: Joi.string().guid(),
  }),
};
