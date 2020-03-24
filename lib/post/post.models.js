const Joi = require('joi');
// const PostalAddressDB = require('../postal-address').models.PostalAddressDB;

module.exports = {
  db: (sequelize, Sequelize) => {
    const Post = sequelize.define('Post', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: Sequelize.STRING,
      body: Sequelize.TEXT,
    });


    Post.associate = function (models) {
      models.Post.belongsTo(models.Account, {as: 'Author'});
    };

    return Post;
  },
  id: Joi.object().keys({
    // id: Joi.string().guid().required(),
    id: Joi.string().required(),
  }),
  api: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
  })
};
