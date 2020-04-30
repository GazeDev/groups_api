const Joi = require('joi');

module.exports = {
  db: (sequelize, Sequelize) => {
    const Comment = sequelize.define('Comment', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      body: Sequelize.TEXT,
    });


    Comment.associate = function (models) {
      models.Comment.belongsTo(models.Account, {as: 'Author'});
    };

    return Comment;
  },
  id: Joi.object().keys({
    // id: Joi.string().guid().required(),
    id: Joi.string().required(),
  }),
  api: Joi.object().keys({
    body: Joi.string().required(),
  })
};
