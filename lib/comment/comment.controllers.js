module.exports = (models) => {
  const Boom = require('boom');
  const commentModels = require('./comment.models');
  const accountLib = require('../account/account.controllers')(models).lib;
  const postLib = require('../post/post.controllers')(models).lib;
  const groupLib = require('../group/group.controllers')(models).lib;

  return {
    postComment: async function (request, h) {
      let postId = request.params.postId;
      let commentId = request.params.id;


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
        AuthorId: account.id,
        body: request.payload.body,
        postId: postId,
        commentId: commentId,
      };

      let comment;
      try {
        comment = await createComment(commentObject);
      } catch (e) {
        throw Boom.badImplementation('Error during createComment(commentObject). ' + e);
      }
      return comment;
    },};

    function createComment(commentObject) {
      return models.Comment.create(commentObject)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    }

    async function getPostItem(postId) {
      let postItem;
      try {
        postItem = await postLib.getPost(postId);
      } catch (e) {
        throw Boom.badImplementation('Error during getItem(postId). ' + e);
      }
      return postItem;
    }

};
