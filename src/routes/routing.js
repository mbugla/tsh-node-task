const express = require('express');

const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const postController = require('../controllers/posts');
const { ApiError } = require('../exceptions/api');

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

router.post('/posts', [
  body('title')
    .not().isEmpty()
    .trim()
    .escape(),
  body('content')
    .isLength({ min: 3 })
    .trim()
    .escape(),
], asyncMiddleware(async (req, res) => {
  const createdPost = await postController.addPost(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array(), 422);
  }
  res
    .status(201)
    .json({
      message: 'Post created',
      payload: createdPost.toJSON(),
    });
}));

router.get('/posts', asyncMiddleware(async (req, res) => {
  const posts = await postController.getPosts();

  res
    .status(200)
    .json({
      payload: posts,
    });
}));

router.get('/posts/:postId', asyncMiddleware(async (req, res) => {
  const post = await postController.getPostById(req.params.postId);

  res
    .status(200)
    .json({
      payload: post.toJSON(),
    });
}));

router.delete('/posts/:postId', asyncMiddleware(async (req, res) => {
  await postController.removePostById(req.params.postId);

  res
    .status(204)
    .json({
      message: 'Post removed',
    });
}));

router.use((err, req, res, next) => {
  if (Object.prototype.isPrototypeOf.call(ApiError.prototype, err)) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Something goes wrong :(' });
});


module.exports = router;
