module.exports = (models) => {
  const Boom = require('boom');
  const commentModels = require('./post.models');
  const accountLib = require('../account/account.controllers')(models).lib;

  return {
    getPost: async function(request, h) {
      let returnPosts;
      try {
        returnPosts = await getPosts(request.query);
      } catch (e) {
        throw Boom.badImplementation('Error during getPosts(). ' + e);
      }
      return h
        .response(returnPosts);
    },
    getPost: async function(request, h) {
      const returnPost = await getPost(request.params.id);
      // TODO: use try/catch with await?
      return h
        .response(returnPost);
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

      let postObject = {
        id: account.id,
        title: request.payload.title,
        body: request.payload.body,
        postId: postId,
      };

      let post;
      try {
        post = await createPost(postObject);
      } catch (e) {
        throw Boom.badImplementation('Error during createPost(postObject). ' + e);
      }
      return post;
    }


  }

  function getPostOptions(queryParams) {
     let whereParams = {};
     let postOptions = {};
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
           {
             body: {
               [Op.iLike]: '%' + queryParams.search + '%',
             }
           },
         ]
       };
       postOptions.where = whereParams;
       return postOptions;
     }
     // else, no 'search' queryParam
     if (Object.prototype.hasOwnProperty.call(queryParams, 'title')) {
       whereParams.name = {
         [Op.iLike]: '%' + queryParams.name + '%',
       };
     }
     if (Object.prototype.hasOwnProperty.call(queryParams, 'body')) {
       whereParams.phone = {
         [Op.iLike]: '%' + queryParams.phone + '%',
       };
     }

     postOptions.where = whereParams;
     return postOptions;
   }


  function getPosts(queryParams = {}) {
  return models.Post.findAll(getPostOptions(queryParams));
  }

  function getPost(id) {
    return models.Post.findByPk(id, getPostOptions())
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function createPost(postObject) {
  return models.Post.create(postObject)
  .then(response => {
    return response;
  })
  .catch(error => {
    return error;
  });
  }


};
