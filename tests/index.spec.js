jest.mock('uuid', () => ({
  v4: () => '81d18e4a-45dd-4bcf-b79b-2abd8b932663',
}));

const request = require('supertest');
const app = require('../src/index');

describe('App', () => {
  it('creates post', (done) => {
    request(app)
      .post('/posts')
      .send({
        title: 'some title',
        content: 'some content',
      })
      .end((err, res) => {
        expect(res.body).toEqual({
          message: 'Post created',
          payload: {
            id: '81d18e4a-45dd-4bcf-b79b-2abd8b932663',
            title: 'some title',
            content: 'some content',
          },
        });
        done();
      });
  });

  it('gets post', (done) => {
    request(app)
      .get('/posts/81d18e4a-45dd-4bcf-b79b-2abd8b932663')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual({
          payload: {
            id: '81d18e4a-45dd-4bcf-b79b-2abd8b932663',
            title: 'some title',
            content: 'some content',
          },
        });
        done();
      });
  });

  it('gets posts', (done) => {
    request(app)
      .get('/posts')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual({
          payload: [{
            id: '81d18e4a-45dd-4bcf-b79b-2abd8b932663',
            title: 'some title',
            content: 'some content',
          }],
        });
        done();
      });
  });

  it('remove post', (done) => {
    const server = request(app);
    server
      .delete('/posts/81d18e4a-45dd-4bcf-b79b-2abd8b932663')
      .expect(204)
      .end(() => {
        server
          .get('/posts')
          .end((err, res) => {
            expect(res.body.payload).toHaveLength(0);
            done();
          });
      });
  });

  it('returns 404 on not found post', (done) => {
    request(app)
      .get('/posts/not-existing-id')
      .expect(404)
      .end((err, res) => {
        expect(res.body).toEqual({
          error: 'Missing post with id: not-existing-id',
        });
        done();
      });
  });

  it('returns 404 when try to delete not existing post', (done) => {
    request(app)
      .delete('/posts/not-existing-id')
      .expect(404)
      .end((err, res) => {
        expect(res.body).toEqual({
          error: 'Missing post with id: not-existing-id',
        });
        done();
      });
  });

  it('returns validation error on empty post title', (done) => {
    request(app)
      .post('/posts')
      .send({
        title: '',
        content: 'some content',
      })
      .expect(422)
      .end((err, res) => {
        expect(res.body).toEqual({
          error: [{
            location: 'body', param: 'title', value: '', msg: 'Invalid value',
          }],
        });
        done();
      });
  });

  it('returns validation error on to short post content', (done) => {
    request(app)
      .post('/posts')
      .send({
        title: 'title',
        content: 's',
      })
      .expect(422)
      .end((err, res) => {
        expect(res.body).toEqual({
          error: [{
            location: 'body', param: 'content', value: 's', msg: 'Invalid value',
          }],
        });
        done();
      });
  });

  it('returns combined validation errors on missing title and to short post content', (done) => {
    request(app)
      .post('/posts')
      .send({
        title: '',
        content: 's',
      })
      .expect(422)
      .end((err, res) => {
        expect(res.body).toEqual({
          error: [
            {
              location: 'body', param: 'title', value: '', msg: 'Invalid value',
            },
            {
              location: 'body', param: 'content', value: 's', msg: 'Invalid value',
            },
          ],
        });
        done();
      });
  });
});
