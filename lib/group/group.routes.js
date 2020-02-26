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
          tags: ['api', 'Group'],
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
        handler: controllers.getGroup,
        config: {
          auth: 'jwt',
          description: 'Get Group by id',
          notes: 'Returns one group.',
          tags: ['api', 'Group'],
          validate: {
            params: groupModels.id,
          }
        }
      },
      {
       method: 'POST',
       path: '/group',
       config: {
         handler: controllers.postGroup,
         description: 'Create Group',
         notes: 'Create a Group in the database.',
         tags: ['api', 'Group'],
         validate: {
           payload: groupModels.api,
         }
       }
     },


    ];
  },
};
