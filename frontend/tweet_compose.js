const APIUtil = require('./api_util.js');

class TweetCompose {
  constructor($el) {
    this.$el = $($el);
    this.$textarea = $(this.$el.find('textarea'));
    this.$el.on('submit', this.submit.bind(this));
    this.$textarea.on('input', this.updateCounter.bind(this));
    this.updateCounter();
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

  updateCounter() {
    const $textarea = this.$el.find('textarea');
    const $counter = this.$el.find('.chars-left');
    let charsLeft = $($textarea).val().length;
    $($counter).text('');
    $($counter).text(`${charsLeft}/140`);
    if (charsLeft >= 140) {
      $($textarea).val(
        $($textarea)
          .val()
          .substring(0, 139)
      );
    }
  }
}

module.exports = TweetCompose;
