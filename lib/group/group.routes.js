const Joi = require('joi');


module.exports = {
  routes: (models) => {
    // const controllers = require('./group.controllers')(models);
    const groupModels = require('./group.models');

    return [
      {
        method: 'GET',
        path: '/groups',
        // handler: controllers.viewAllGroups,
        // TODO: move this into controllers file and expand into real logic
        handler: (request, h) => { return {param: request.params.id,}},
        config: {
          auth: 'jwt',
          description: 'Get Groups',
          notes: 'Returns all groups.',
          tags: ['api', 'Groups'],
          validate: {
            query: groupModels.apiFilterQuery,
          }
        }
      },

      {
        method: 'GET',
        path: '/groups/{id}',
        // handler: controllers.viewGroupDetail,
        // TODO: move this into controllers file and expand into real logic
        handler: (request, h) => { return {param: request.params.id,}},
        config: {
          auth: 'jwt',
          description: 'Get Group by id',
          notes: 'Returns one group.',
          tags: ['api', 'Groups'],
          validate: {
            params: groupModels.id,
          }
        }
      },

      {
        method: 'POST',
        path: '/groups',
        handler: (request, h) => { return {param: request.params.id,}},
        config: {
          auth: 'jwt',
          // handler: controllers.postGroup,
          // TODO: move this into controllers file and expand into real logic
          description: 'Create group',
          notes: 'Create group in the database',
          tags: ['api', 'Groups'],
          validate: {
            payload: propertyModels.api,
          }
        }
      },


    ];
  },
};
