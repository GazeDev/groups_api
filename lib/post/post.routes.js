const Joi = require('joi');


module.exports = {
  routes: (models) => {
    const controllers = require('./post.controllers')(models);
    const postModels = require('./post.models');
    const groupModels = require('../group/group.models');

    return [
      {
        method: 'GET',
        path: '/posts',
        handler: controllers.getPosts,
        config: {
          auth: 'jwt',
          description: 'Get Posts',
          notes: 'Returns all posts.',
          tags: ['api', 'Posts'],
          // Search not part of MVP.
          // validate: {
          //  query: postModels.apiFiltserQuery,
          // }
        }
      },

      {
        method: 'GET',
        path: '/posts/{id}/',
        handler: controllers.getPost,
        config: {
          auth: 'jwt',
          description: 'Get Post from Post Id',
          notes: 'Returns a post',
          tags: ['api', 'Posts'],
          validate: {
            params: postModels.id,
          }
        }
      },

      {
        method: 'GET',
        path: '/groups/{id}/posts',
        handler: controllers.getGroupPosts,
        config: {
          auth: 'jwt',
          description: 'Get Posts from Group Id',
          notes: 'Returns all the posts from a given group',
          tags: ['api', 'Groups', 'Posts'],
          validate: {
            params: groupModels.id,
          }
        }
      },

      {
       method: 'POST',
       path: '/groups/{id}/posts',
       config: {
         auth: 'jwt',
         handler: controllers.postPost,
         description: 'Create Post',
         notes: 'Create a Post in the Specified Group.',
         tags: ['api', 'Posts', 'Groups'],
         validate: {
           params: groupModels.id,
           payload: postModels.api,
         }
       }
     },


    ];
  },
};
