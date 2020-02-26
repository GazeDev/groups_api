const Joi = require('joi');


module.exports = {
  routes: (models) => {
    const controllers = require('./post.controllers')(models);
    const postModels = require('./post.models');
    const groupModels = require('../group/group.models');

    return [
      {
       method: 'POST',
       path: '/groups/{id}/posts',
       config: {
         handler: controllers.postPost,
         description: 'Create Post',
         notes: 'Create a Post in the Specified Group.',
         tags: ['api', 'Post', 'Group'],
         validate: {
           params: groupModels.id,
           payload: postModels.api,
         }
       }
     },
    ];
  },
};
