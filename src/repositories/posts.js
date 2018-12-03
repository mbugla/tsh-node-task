const { ApiError } = require('../exceptions/api');

let posts = [];

async function addPost(post) {
  posts.push(post);

  return post;
}

async function getPostById(postId) {
  const storedPost = posts.find(post => post.id === postId);

  if (!storedPost) {
    throw new ApiError(`Missing post with id: ${postId}`, 404);
  }

  return storedPost;
}

async function removePostById(postId) {
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex < 0) {
    throw new ApiError(`Missing post with id: ${postId}`, 404);
  }

  posts = posts.filter(post => post.id !== postId);
}

async function getPosts() {
  return posts;
}

module.exports = {
  getPostById,
  getPosts,
  addPost,
  removePostById,
};
