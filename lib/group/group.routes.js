const Joi = require('joi');


module.exports = {
  routes: (models) => {
    // const controllers = require('./group.controllers')(models);
    const controllers = require('./group.controllers')(models);
    const groupModels = require('./group.models');

    return [
      {
        method: 'GET',
        path: '/groups',
        // handler: controllers.viewAllGroups,
        // TODO: move this into controllers file and expand into real logic
        handler: controllers.getGroups,
        config: {
          auth: 'jwt',
          description: 'Get Groups',
          notes: 'Returns all groups.',
          tags: ['api', 'Groups'],
          // Search not part of MVP.
          // validate: {
          //  query: groupModels.apiFilterQuery,
          // }
        }
      },
      {
        method: 'GET',
        path: '/groups/{id}',
        // handler: controllers.viewGroupDetail,
        // TODO: move this into controllers file and expand into real logic
        handler: controllers.getGroup,
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
        method: 'GET',
        path: '/groups/schema',
        config: {
          handler: controllers.getGroupsSchema,
          description: 'Get Groups Schema',
          notes: 'Returns the json schema for a group.',
          tags: ['api', 'Groups'],
        }
      },
      {
        method: 'POST',
        path: '/groups',
        handler: controllers.postGroup,
        options: {
          auth: 'jwt',
          description: 'Create Group',
          notes: 'create a group and receive the group object in return',
          tags: ['api', 'Groups'],
          validate: {
            payload: groupModels.api,
          }
        },
      },
    ];
  },
};
