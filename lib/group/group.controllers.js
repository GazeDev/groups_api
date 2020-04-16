const Joi = require('joi');

module.exports = (models) => {
  const Boom = require('boom');
  const Sequelize = require('sequelize');
  const Op = Sequelize.Op;
  const groupModels = require('./group.models');
  const accountLib = require('../account/account.controllers')(models).lib;

  return {
    getGroups: async function(request, h) {
      let returnGroups;
      try {
        returnGroups = await getGroups();
      } catch (e) {
        throw Boom.badImplementation('Error during getGroups(). ' + e);
      }
      return h
        .response(returnGroups);
    },

    getGroup: async function(request, h) {
      let returnGroup;
      try {
        returnGroup = await getGroup(request.params.id);
      } catch (e) {
        throw Boom.badImplementation('Error during getGroup(request.query). ' + e);
      }
      return h
        .response(returnGroup);
    },

    postGroup: async function(request, h) {
      let group = request.payload;

      // Throw if no account found
      let account = await ensureAccount(request);

      /* Restrict AdminId to same user, or SuperAdmin */
      if (group.AdminId) {
        // If AdminId is set then we have already passed auth and account lookup
        if (
          group.AdminId !== account.id  &&
          request.auth.credentials.subjectId !== process.env.SUPER_ADMIN
        ) {
          throw Boom.badRequest('Group.AdminId must match your Account ID or you must be a Super Admin');
        }
      }

      // then see if group exists
      let groupTitle = await lookupGroupFromTitle(group.title);
      if (Array.isArray(groupTitle) && groupTitle.length) {
        let error = Boom.badData('Group with that name already exists');
        error.output.headers["Content-Location"] = groupTitle[0].id;
        throw error;
      }

      // then if not, we create the group
      let newgroup;
      try {
        newGroup = await createGroup(group);
      } catch (e) {
        throw Boom.badImplementation('Error during createGroup(group). ' + e);
      }

      return h
        .response(newGroup);

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
      getGroup: getGroup,
    },
  };

  function getGroups() {
    return models.Group.findAll()
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function getGroup(id) {
    return models.Group.findByPk(id)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function createGroup(groupObject) {
    return models.Group.create(groupObject)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function lookupGroupFromTitle(title) {
    return models.Group.findAll({
      where: {
        title: title,
      }
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  async function ensureAccount(request) {
    let account;
    try {
      account = await accountLib.getCurrentAccount(request.auth.credentials);
    } catch (e) {
      throw Boom.badImplementation('Error during getCurrentAccount(request.auth.credentials). ' + e);
    }

    if (account === null) {
      throw Boom.badRequest('Must have an Account');
    }

    return account;
  }

};
