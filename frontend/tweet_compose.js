const APIUtil = require('./api_util.js');

class TweetCompose {
  constructor($el) {
    this.$el = $($el);
    this.$el.on('submit', this.submit.bind(this));
  }

  submit(e) {
    e.preventDefault();
    const $textContent = this.$el.find('textarea').val();
    // gets user_id from selected in dropdown
    const $dropdownContent = this.$el.find('select').val();
    APIUtil.createTweet(data).then(() => {
      // do stuff
    });
  }
}

module.exports = TweetCompose;
