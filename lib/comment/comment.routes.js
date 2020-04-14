const Joi = require('joi');

module.exports = {
  routes: (models) => {
    const controllers = require('./comment.controllers')(models);
    const commentModels = require('./comment.models');
    const postModels = require('../post/post.models');
    const groupModels = require('../group/group.models');

    return [
      {
        method: 'GET',
        path: '/comments',
        handler: controllers.getComments,
        config: {
          auth: 'jwt',
          description: 'Get Comments',
          notes: 'Returns all comments.',
          tags: ['api', 'Comments'],
          validate: {
            // query: commentModels.apiFilterQuery,
          }
        }
      },

      {
        method: 'GET',
        path: '/comments/{id}',
        handler: controllers.getComment,
        config: {
          auth: 'jwt',
          description: 'Get Comment by id',
          notes: 'Returns one comment.',
          tags: ['api', 'Comments'],
          validate: {
            params: commentModels.id,
          }
        }
      },

      {
        method: 'GET',
        path: '/posts/{id}/comments',
        handler: controllers.getPostComments,
        config: {
          auth: 'jwt',
          description: 'Get Comments from Post Id',
          notes: 'Returns all the comments from a given post',
          tags: ['api', 'Comments'],
          validate: {
            params: postModels.id,
          }
        }
      },

      {
       method: 'POST',
       path: '/posts/{id}/comment',
       config: {
         auth: 'jwt',
         handler: controllers.postComment,
         description: 'Create a Comment For Post',
         notes: 'Create a comment in the database.',
         tags: ['api', 'Comments'],
         validate: {
           params: postModels.id,
           payload: commentModels.api,
         }
       }
     }

    ];
  },
};
