module.exports = {
  routes: (models) => {
    const controllers = require('./account.controllers')(models);
    const accountModels = require('./account.models');
    return [
      {
        method: 'GET',
        path: '/accounts',
        handler: controllers.getCurrentAccount,
        config: {
          auth: 'jwt',
          description: 'Get Current Authentication Account',
          notes: 'Get the account associated with the current authentication',
          tags: ['api', 'Accounts'],
        }
      },
      {
        method: 'GET',
        path: '/accounts/all',
        handler: controllers.getAccounts,
        config: {
          auth: 'jwt',
          description: 'Get Account',
          notes: 'Get A list of all accounts in the system',
          tags: ['api', 'Accounts'],
        }
      },
      {
        method: 'GET',
        path: '/accounts/{id}',
        handler: controllers.getAccount,
        config: {
          auth: 'jwt',
          description: 'Get Account by id',
          notes: 'Returns one account',
          tags: ['api', 'Accounts'],
          validate: {
            params: accountModels.id,
          }
        }
      },
      {
        method: 'POST',
        path: '/accounts',
        handler: controllers.postAccount,
        options: {
          auth: 'jwt',
          description: 'Create Account',
          notes: 'create a account and receive the account object in return',
          tags: ['api', 'Accounts'],
        },
      },

      {
        method: 'PATCH',
        path: '/accounts/{id}',
        config: {
          auth: 'jwt',
          handler: controllers.patchAccount,
          description: 'Update an Account',
          notes: 'Update an Account displayName in the database.',
          tags: ['api', 'Accounts'],
          validate: {
            params: accountModels.id,
            payload: accountModels.apiPatch,
          }
        }
      },
      // {
      //   method: 'DELETE',
      //   path: '/accounts/{id}',
      //   config: {
      //     handler: controllers.deleteAccount,
      //     description: 'Delete Account',
      //     notes: 'delete a account',
      //     tags: ['api', 'Accounts'],
      //     validate: {
      //       params: accountModels.id,
      //     }
      //   }
      // },
    ];
  },
};
