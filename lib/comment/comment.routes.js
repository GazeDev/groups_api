const Joi = require('joi');


module.exports = {
  routes: (models) => {
    // const controllers = require('./comment.controllers')(models);
    const commentModels = require('./comment.models');

    return [
        {
            method: 'GET',
            path: '/comments',
            // handler: controllers.viewAllComments,
            // TODO: move this into controllers file and expand into real logic
            handler: (request, h) => { return {param: request.params.id,}},
            config: {
              auth: 'jwt',
              description: 'Get Comments',
              notes: 'Returns all comments.',
              tags: ['api', 'Comment'],
            }
          },

      {
        method: 'GET',
        path: '/comments/{id}',
        // handler: controllers.viewCommentDetail,
        // TODO: move this into controllers file and expand into real logic
        handler: (request, h) => { return {param: request.params.id,}},
        config: {
          auth: 'jwt',
          description: 'Get Comment by id',
          notes: 'Returns one comment.',
          tags: ['api', 'Comment'],
          validate: {
            params: commentModels.id,
          }
        }
      },


    ];
  },
};
