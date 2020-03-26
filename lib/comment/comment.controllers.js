const Joi = require('joi');

module.exports = (models) => {

  const Boom = require('boom');
  const commentModels = require('./comment.models');
  const accountLib = require('../account/account.controllers')(models).lib;
  const postLib = require('../post/post.controllers')(models).lib;
  const groupLib = require('../group/group.controllers')(models).lib;

  return {
    getComments: async function(request, h) {
      let returnComments;
      try {
        returnComments = await getComments(request.query);
      } catch (e) {
        throw Boom.badImplementation('Error during getComments(request.query). ' + e);
      }
      return h.response(returnComments);
    },

    getComment: async function(request, h) {
      let returnComment;
      try {
        returnComment = await getComment(request.params.id);
      }
      catch (e){
        throw Boom.badImplementation('Error during getComment(request.query). ' + e);
      }
      return h.response(returnComment);
    },

    postComment: async function (request, h) {
      let postId = request.params.id;

      let account;
      try {
        account = await accountLib.getAccount(request.auth.credentials);
      } catch (e) {
        throw Boom.badImplementation('Error during getAccount(request.auth.credentials). ' + e);
      }

      if (account === null) {
        throw Boom.badRequest('Must have an Account to create a Comment');
      }

      let postItem;
      try {
        postItem = await getPostItem(postId);
      } catch (e) {
        throw Boom.badImplementation('Error during getPostItem(postId). ' + e);
      }

      if (postItem === null) {
        throw Boom.badRequest('postItem does not exist');
      }

      let commentObject = {
        body: request.payload.body,
        PostId: postId,
        AuthorId: account.id
      };

      let comment;
      try {
        comment = await createComment(commentObject);
      } catch (e) {
        throw Boom.badImplementation('Error during createComment(commentObject). ' + e);
      }
      return comment;
    },

    lib: {
      getComment: getComment,
    },
  };

    function getComments(queryParams = {}) {
      return models.Comment.findAll(getCommentOptions(queryParams));
    }

    function getCommentOptions(queryParams) {
      let whereParams = {};
      let commentOptions = {};
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
        commentOptions.where = whereParams;
        return commentOptions;
      }
      // else, no 'search' queryParam
      if (Object.prototype.hasOwnProperty.call(queryParams, 'title')) {
        whereParams.title = {
          [Op.iLike]: '%' + queryParams.title + '%',
        };
      }

      commentOptions.where = whereParams;
      return commentOptions;
    }

    function getComment(id) {
      return models.Comment.findByPk(id)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }

    function createComment(commentObject) {
      return models.Comment.create(commentObject)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }

    function getPostItem(id) {
      return models.Post.findByPk(id)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }



};
