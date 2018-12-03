const repository = require('../repositories/posts');
const Post = require('../models/post');

async function getPosts() {
  const result = await repository.getPosts();

  return result;
}

async function addPost(requestBody) {
  const post = Post.fromRequestBody(requestBody);
  await repository.addPost(post);

  return post;
}

async function getPostById(postId) {
  const post = await repository.getPostById(postId);

  return post;
}

async function removePostById(postId) {
  await repository.removePostById(postId);
}

module.exports = {
  getPosts,
  addPost,
  getPostById,
  removePostById,
};
