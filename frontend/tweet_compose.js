const APIUtil = require('./api_util.js');

class TweetCompose {
  constructor($el) {
    this.$el = $($el);
    this.$el.on('submit', this.submit.bind(this));
  }

  submit(e) {
    e.preventDefault();
    const formData = this.$el.serializeJSON();
    // disables all inputs while we try to add to DB
    this.$el.find(':input').prop('disabled', true);
    // sends form data to ajax call
    APIUtil.createTweet(formData)
      .then(data => {
        this.handleSuccess(data);
      })
      .fail(err => {
        this.$el.find(':input').prop('disabled', false);
      });
  }

  clearInput() {
    this.$el.find('textarea').val('');
    this.$el.find('select').val('');
  }

  handleSuccess(data) {
    this.$el.find(':input').prop('disabled', false);
    this.clearInput();
    const $ul = $(this.$el.attr('data-tweets-ul'));
    const $li = $('<li></li>');
    $ul.prepend($li.append(JSON.stringify(data)));
  }
}

module.exports = TweetCompose;
