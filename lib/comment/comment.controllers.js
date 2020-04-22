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
        returnComments = await getComments();
      } catch (e) {
        throw Boom.badImplementation('Error during getComments(). ' + e);
      }
      return h
        .response(returnComments);
    },

    getComment: async function(request, h) {
      let returnComment;
      try {
        returnComment = await getComment(request.params.id);
      }
      catch (e){
        throw Boom.badImplementation('Error during getComment(request.query). ' + e);
      }
      return h
        .response(returnComment);
    },

    getPostComments: async function(request, h) {
      let returnPostComments;
      try {
        returnPostComments = await getPostComments(request.params.id);
      }
      catch (e){
        throw Boom.badImplementation('Error during getPostComments(request.query). ' + e);
      }
      return h
        .response(returnPostComments);
    },

    postComment: async function (request, h) {
      let postId = request.params.id;

      let account;
      try {
        account = await accountLib.getCurrentAccount(request.auth.credentials);
      } catch (e) {
        throw Boom.badImplementation('Error during getCurrentAccount(request.auth.credentials). ' + e);
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
      return models.Comment.findAll()
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
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

    function getPostComments(postId) {
      let postOptions = {
        where: {
          PostId: postId,
        },
      };
      return models.Comment.findAll(postOptions)
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
