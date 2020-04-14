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
      // account has many groups through Accountgroups
      // models.groups has many groups through accounts
      models.Account.belongsToMany(models.Group, {through: 'AccountGroup'});
      models.Group.belongsToMany(models.Account, {through: 'AccountGroup'});
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
