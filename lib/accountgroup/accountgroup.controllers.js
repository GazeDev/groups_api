const Joi = require('joi');

module.exports = (models) => {

  const Boom = require('boom');
  const accountgroupModels = require('./accountgroup.models');
  const accountLib = require('../account/account.controllers')(models).lib;
  const postLib = require('../post/post.controllers')(models).lib;
  const groupLib = require('../group/group.controllers')(models).lib;

  return {
    getAllAccountGroups: async function(request, h) {
      let returnAccountGroups;
      try {
        returnAccountGroups = await getAccountGroups(request.query);
      } catch (e) {
        throw Boom.badImplementation('Error during getAllAccountGroups(request.query). ' + e);
      }
      return h.response(returnAccountGroups);
    },

    getAccountGroup: async function(request, h) {
      let returnAccountGroup;
      try {
        returnAccountGroup = await getAccountGroup(request.params.id);
      }
      catch (e){
        throw Boom.badImplementation('Error during getAllAccountGroup(request.query). ' + e);
      }
      return h.response(returnAccountGroup);
    },

    getGroupsFromAccount: async function(request, h) {
      const returnGroupAccounts = await getGroupsFromAccount2(request.params.id);

      return h
        .response(returnGroupAccounts);
    },

    getAccountsFromGroup: async function(request, h) {
      const returnGroupAccounts = await getAccountsFromGroup2(request.params.id);

      return h
        .response(returnGroupAccounts);
    },


    createAccountsFromGroup: async function(request, h) {
        let groupId = request.payload.GroupId;
        let memberId = request.payload.AccountId;

        let groupInstance = await getGroupItem(groupId);

        // Make sure member/account exists
        if (groupInstance === null) {
          throw Boom.badRequest('Group does not exist');
        }

        // let existingMemberId = groupInstance.AccountId;
        //
        // if (existingMemberId !== null) {
        //   if (existingMemberId === memberId) {
        //     throw Boom.badRequest('This Group already has this member');
        //   }
        // }

        let accountGroupObject = {
          AccountId: memberId,
          GroupId: groupId,
        };

        try {
          accountGroup = await createAccountGroup(accountGroupObject);
        } catch (e) {
          throw Boom.badImplementation('Error during createPost(postObject). ' + e);
        }

        return h
          .response(accountGroup);
    },


    lib: {
    },
  };



    function getAccountGroups(queryParams = {}) {
      return models.AccountGroup.findAll(getAccountGroupOptions(queryParams));
    }

    function getAccountGroupOptions(queryParams) {
      let whereParams = {};
      let accountGroupOptions = {};
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
        accountGroupOptions.where = whereParams;
        return accountGroupOptions;
      }
      // // else, no 'search' queryParam
      // if (Object.prototype.hasOwnProperty.call(queryParams, 'title')) {
      //   whereParams.title = {
      //     [Op.iLike]: '%' + queryParams.title + '%',
      //   };
      // }

      accountGroupOptions.where = whereParams;
      return accountGroupOptions;
    }

    function getAccountGroup(id) {
      return models.AccountGroup.findByPk(id)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }

    function getGroupsFromAccount2(accountId) {
      let groupOptions = {
        where: {
          AccountId: accountId,
        },
      };
      // might be finding from AccountGroup and not Account
      return models.AccountGroup.findAll(groupOptions);
    }


    function getAccountsFromGroup2(groupId) {
      let accountOptions = {
        where: {
          GroupId: groupId,
        },
      };
      // might be finding from AccountGroup and not Groups
      return models.AccountGroup.findAll(accountOptions);
    }


    function createAccountGroup(accountGroupObject) {
      return models.AccountGroup.create(accountGroupObject)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }

    function getGroupItem(id) {
      return models.Group.findByPk(id)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }




};
