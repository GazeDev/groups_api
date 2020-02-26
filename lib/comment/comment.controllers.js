module.exports = (models) => {

  const Boom = require('boom');
  const commentModels = require('./comment.models');
  const accountLib = require('../account/account.controllers')(models).lib;
  const postLib = require('../post/post.controllers')(models).lib;
  const groupLib = require('../group/group.controllers')(models).lib;
  console.log(postLib)
  return {
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
        PostId: postId
      };

      let comment;
      try {
        comment = await createComment(commentObject);
      } catch (e) {
        throw Boom.badImplementation('Error during createComment(commentObject). ' + e);
      }
      return comment;
    },


  };

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
      let getItem = postLib.getPost;
      let postItem;
      try {
        postItem = await getItem(postId);
      } catch (e) {
        throw Boom.badImplementation('Error during getPost(postId). ' + e);
      }

      return postItem;
    }


};
