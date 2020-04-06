const Joi = require('joi');

module.exports = (models) => {
  const Boom = require('boom');
  const Sequelize = require('sequelize');
  const Op = Sequelize.Op;
  const postModels = require('./post.models');
  const accountLib = require('../account/account.controllers')(models).lib;
  const groupLib = require('../group/group.controllers')(models).lib;

  return {
    getPosts: async function(request, h) {
      let returnPosts;
      try {
        returnPosts = await getPosts();
      } catch (e) {
        throw Boom.badImplementation('Error during getPosts(). ' + e);
      }
      return h
        .response(returnPosts);
    },

    getGroupPosts: async function(request, h) {
      let returnGroupPosts;
      try {
        returnGroupPosts = await getGroupPosts(request.params.id);
      } catch (e) {
        throw Boom.badImplementation('Error during getGroupPosts(request.query). ' + e);
      }
      return h
        .response(returnGroupPosts);
    },

    getPost: async function(request, h) {
      let returnPost;
      try {
        returnPost = await getPost(request.params.id);
      } catch (e) {
        throw Boom.badImplementation('Error during getPost(request.query). ' + e);
      }
      return h
        .response(returnPost);
    },

    postPost: async function (request, h) {
      let groupId = request.params.id;
      let account;

      try {
        account = await accountLib.getAccount(request.auth.credentials);
      } catch (e) {
        throw Boom.badImplementation('Error during getAccount(request.auth.credentials). ' + e);
      }

      if (account === null) {
        throw Boom.badRequest('Must have an Account to create a Comment');
      }

      let groupItem;
      try {
        groupItem = await getGroupItem(groupId);
      } catch (e) {
        throw Boom.badImplementation('Error during getGroupItem(postId). ' + e);
      }

      if (groupItem === null) {
        throw Boom.badRequest('groupItem does not exist');
      }

      let postObject = {
        AuthorId: account.id,
        title: request.payload.title,
        body: request.payload.body,
        GroupId: groupId,
      };

      let post;
      try {
        post = await createPost(postObject);
      } catch (e) {
        throw Boom.badImplementation('Error during createPost(postObject). ' + e);
      }
      return post;
    },
    lib: {
      getPost: getPost,
    },
  }

  function getPosts() {
    return models.Post.findAll()
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });;
  }

  function getPost(postId) {
    return models.Post.findByPk(id)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  }

  function getGroupPosts(groupId) {
    let groupOptions = {
      where: {
        GroupId: groupId,
      },
    };

    return models.Post.findAll(groupOptions)
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
