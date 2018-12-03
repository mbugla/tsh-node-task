const repository = require('../../src/repositories/posts');

const Post = require('../../src/models/post');

describe('Posts Repository', () => {
  it('allows to store post', async () => {
    const post = await repository.addPost(new Post('123', 'title', 'content'));

    expect(post.toJSON()).toEqual({
      id: '123',
      title: 'title',
      content: 'content',
    });
  });

  it('allows to retreive single post', async () => {
    await repository.addPost(new Post('456', 'title', 'content'));
    const retreivedPost = await repository.getPostById('123');
    expect(retreivedPost.toJSON()).toEqual({
      id: '123',
      title: 'title',
      content: 'content',
    });
  });

  it('is able to retreive all stored posts', async () => {
    const retreivedPosts = await repository.getPosts();
    expect(retreivedPosts).toHaveLength(2);
  });

  it('allows to remove post', async () => {
    await repository.removePostById('123');
    const retreivedPosts = await repository.getPosts();
    expect(retreivedPosts).toHaveLength(1);
  });
});
