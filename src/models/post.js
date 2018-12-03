const { v4 } = require('uuid');

class Post {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  static fromRequestBody(body) {
    return new this(v4(), body.title, body.content);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
    };
  }
}

module.exports = Post;
