module.exports = (models) => {
  const Boom = require('boom');

  return {
    getCurrentAccount: async function(request, h) {
      let externalId = request.auth.credentials.subjectId;
      let account;
      try {
        account = await getCurrentAccount(request.auth.credentials);
      } catch (e) {
        throw Boom.badImplementation('Error during getAccount(request.auth.credentials). ' + e);
      }

      if (account === null) {
        throw Boom.notFound("No account found for the provided credentials.");
      }

      return account;
    },

    getAccounts: async function(request, h) {
      let returnAccounts;
      try {
        returnAccounts = await getAccounts();
      } catch (e) {
        throw Boom.badImplementation('Error during getAccounts(request.query). ' + e);
      }
      return h
        .response(returnAccounts);
    },

    getAccount: async function(request, h) {
      let returnAccount;
      try {
        returnAccount = await getAccount(request.params.id);
      } catch (e) {
        throw Boom.badImplementation('Error during getAccount(request.query). ' + e);
      }
      return h
        .response(returnAccount);
    },

    postAccount: async function(request, h) {
      let credentials = request.auth.credentials;
      let account;

      // Check to see that a user has the proper account credentials
      try {
        account = await getCurrentAccount(credentials);
      } catch (e) {
        throw Boom.badImplementation('Error during postAccount - getAccount(credentials). ' + e);
      }
      // Check to see that an account doesn't already exist for the retrieved credentials
      if (account !== null) {
        throw Boom.conflict("Account already exists for provided credentials");
      }

      // Check to see if an account with the given username exists
      let accountUsername = await lookupAccountFromUsername(request.payload.username);
      if (Array.isArray(accountUsername) && accountUsername.length) {
        let error = Boom.badData('Account with that username already exists');
        error.output.headers["Content-Location"] = accountUsername[0].id;
        throw error;
      }

      // then if not, we create the account
      return models.Account.create({
        username: request.payload.username,
        externalId: credentials.subjectId,
      })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    },
    // deleteAccount: function(request, h) {
    //   return models.Account.destroy({
    //     where: {
    //       id: request.params.id,
    //     },
    //   })
    //   .then(response => {
    //     return h
    //     .response(response)
    //     .code(202);
    //   })
    //   .catch(error => {
    //     return error;
    //   });
    // },
    lib: {
      getCurrentAccount: getCurrentAccount,
    },
  };

  function getCurrentAccount(credentials) {
    return models.Account.findOne({
      where: {
        externalId: credentials.subjectId,
      }
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function getAccounts() {
    return models.Account.findAll()
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function getAccount(id) {
    return models.Account.findByPk(id)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function lookupAccountFromUsername(username) {
    return models.Account.findAll({
      where: {
        username: username,
      }
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

};
