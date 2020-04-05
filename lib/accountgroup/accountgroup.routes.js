module.exports = {
  routes: (models) => {
    const controllers = require('./accountgroup.controllers')(models);
    const accountgroupModel = require('./accountgroup.models');
    const groupModels = require('../group/group.models');
    const accountModels = require('../account/account.models');

    return [
      {
        method: 'GET',
        path: '/accountgroup',
        handler: controllers.getAllAccountGroups,
        config: {
          auth: 'jwt',
          description: 'Get All AccountGroup',
          notes: 'Returns all account group relationships.',
          tags: ['api', 'AccountGroups', 'Accounts', 'Groups'],
          validate: {
            // query: commentModels.apiFilterQuery,
          }
        }
      },

      {
        method: 'GET',
        path: '/accountgroup/{id}',
        handler: controllers.getAccountGroup,
        config: {
          auth: 'jwt',
          description: 'Get AccountGroup by id',
          notes: 'Returns one AccountGroup.',
          tags: ['api', 'AccountGroups'],
          validate: {
            params: accountgroupModel.id,
          }
        }
      },

      {
        method: 'GET',
        path: '/accountgroup/account/{id}',
        handler: controllers.getGroupsFromAccount,
        config: {
          auth: 'jwt',
          description: 'Get all Groups from Account Id ',
          notes: 'Given an account id, should return all groups that the user has joined',
          tags: ['api', 'AccountGroups', 'Groups', 'Accounts'],
          validate: {
            params: accountModels.id,
          }
        }
      },

      {
        method: 'GET',
        path: '/accountgroup/group/{id}',
        handler: controllers.getAccountsFromGroup,
        config: {
          auth: 'jwt',
          description: 'Get all Accounts from Group Id ',
          notes: 'Given an group id, should return all members that have joined',
          tags: ['api', 'AccountGroups', 'Groups', 'Accounts'],
          validate: {
            params: groupModels.id,
          }
        }
      },

      {
       method: 'POST',
       path: '/accountgroup/group/{id}',
       config: {
         auth: 'jwt',
         handler: controllers.createAccountsFromGroup,
         description: 'Create an AccountGroup',
         notes: 'Create a AccountGroup in the database.',
         tags: ['api', 'Accounts', 'AccountGroups', 'Groups'],
         validate: {
           payload: accountgroupModel.api,
         }
       }
     },


    ];
  },
};
