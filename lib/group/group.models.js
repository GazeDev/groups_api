const Joi = require('joi');

module.exports = {
  db: (sequelize, Sequelize) => {
    const Group = sequelize.define('Group', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: Sequelize.STRING,
      short_description: Sequelize.STRING,
      description: Sequelize.TEXT,
    });


    Group.associate = function (models) {
      models.Group.belongsTo(models.Account, {as: 'Admin'});
      models.Group.hasMany(models.Post);
    };

    return Group;
  },
  id: Joi.object().keys({
    // id: Joi.string().guid().required(),
    id: Joi.string().required(),
  }),
  api: Joi.object().keys({
      title: Joi.string(),
      short_description: Joi.string(),
      description: Joi.string(),
      AdminId: Joi.string().guid(),
  }),
  apiFilterQuery: Joi.object({
    search: Joi.string().optional(),
    title: Joi.string().optional(),
    // If search is used, other params shouldn't be
  }).without('search', ['title']),
  object: Joi.object().keys({
    title: Joi.string().required(),
    short_description: Joi.string().required(),
    description: Joi.string().required(),
    AdminId: Joi.string().guid(),
  }),
};
