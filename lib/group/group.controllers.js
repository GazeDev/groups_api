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
        returnGroups = await getGroups(request.query);
      } catch (e) {
        throw Boom.badImplementation('Error during getGroups(request.query). ' + e);
      }
      return h
        .response(returnGroups);
    },
    getGroup: async function(request, h) {
      const returnGroup = getGroup(request.params.id);
      return returnGroup;
    },
    // getAccounts: async function(request, h) {
    //   return models.Account.findAll()
    //   .then(response => {
    //     return response;
    //   })
    //   .catch(error => {
    //     return error;
    //   });
    // },
    getGroupsSchema: function(request, h) {
      const convert = require('joi-to-json-schema');
      return convert(groupModels.api);
    },
    postGroup: async function(request, h) {
      let group = request.payload;
      let account;
      /*
        # Require Account for submitting fields
      */
      let noAuth;
      try {
        if (request.auth.credentials) {
          account = await accountLib.getAccount(request.auth.credentials);
        } else {
          noAuth = true;
        }

      } catch (e) {
        throw Boom.badImplementation('Error during getAccount(request.auth.credentials). ' + e);
      }

      if (account === null || noAuth) {
        // User doesn't have an account, operation not allowed
        throw Boom.badRequest('Must have an Account to create a Group');
      }

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

      // nothing to parse for now; Leaving this note for direct comparison to landlord

      // revalidate
      try {
        let revalidate = await Joi.validate(group, groupModels.object);
      } catch (e) {
        throw Boom.badImplementation('Error during Group revalidation.' + e);
      }

      // then see if group exists
      let groupTitle = await lookupGroupFromTitle(group.title);
      if (Array.isArray(groupTitle) && groupTitle.length) {
        let error = Boom.badData('Group with that name already exists');
        error.output.headers["Content-Location"] = Grouptitle[0].id;
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

  function getGroups(queryParams = {}) {
    return models.Group.findAll(getGroupOptions(queryParams));
  }

  function getGroupOptions(queryParams) {
    let whereParams = {};
    let groupOptions = {};
    // hasOwnProperty workaround because query object overwritten, see:
    // https://github.com/hapijs/hapi/issues/3280
    if (Object.prototype.hasOwnProperty.call(queryParams, 'search')) {
      // If there's a 'search' query param, we ignore the others and search
      // specific fields for that value
      whereParams = {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: '%' + queryParams.search + '%',
            }
          },
        ]
      };
      landlordOptions.where = whereParams;
      return landlordOptions;
    }
    // else, no 'search' queryParam
    if (Object.prototype.hasOwnProperty.call(queryParams, 'title')) {
      whereParams.title = {
        [Op.iLike]: '%' + queryParams.title + '%',
      };
    }

    groupOptions.where = whereParams;
    return groupOptions;
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

};