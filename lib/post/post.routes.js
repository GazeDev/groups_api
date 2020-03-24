const Joi = require('joi');


module.exports = {
  routes: (models) => {
    // const controllers = require('./post.controllers')(models);
    const postModels = require('./post.models');
    // const groupModels = require('../group/group.models');
    return [
      {
        method: 'POST',
        path: '/groups/{groupId}/posts',
        // handler: controllers.createPost,
        // TODO: move this into controllers file and expand into real logic
        handler: (request, h) => { return {param: request.params.groupId,}},
        config: {
          auth: 'jwt',
          description: 'Add a Post to a Group',
          notes: '...',
          tags: ['api', 'Post'],
          validate: {
            // TODO: change this to reference group models id once created
            payload: postModels.api,
            params: Joi.object().keys({
              // id: Joi.string().guid().required(),
              groupId: Joi.string().required(),
            }),
          }
        }
      },

    ];
  },
};
