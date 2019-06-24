const APIUtil = require('./api_util.js');

class TweetCompose {
  constructor($el) {
    this.$el = $($el);
    this.$el.on('submit', this.submit.bind(this));
  }

  submit(e) {
    e.preventDefault();
    const tweetData = this.$el.serializeJSON();
    const targetUl = this.$el.attr('data-tweets-ul');
    this.$el.find(':input').prop('disabled', true);
    APIUtil.createTweet(tweetData)
      .then(data => {
        const dataToString = JSON.stringify(data);
        const $ul = $(`ul${targetUl}`);
        const $li = $('<li></li>');
        $ul.prepend($li.append(dataToString));
      })
      .fail(err => {
        this.$el.find(':input').prop('disabled', false);
      });
  }

  clearInput() {
    const allInputs = this.$el.find(':input');
    allInputs.each((i, ele) => {
      $(ele).val('');
    });
  }

  handleSuccess() {}
}

module.exports = TweetCompose;
