/* eslint-disable class-methods-use-this */
const APIUtil = require('./api_util.js');

class TweetCompose {
  constructor($el) {
    this.$el = $($el);
    this.$textarea = $(this.$el.find('textarea'));
    this.$addMentionButton = this.$el.find('.mentions .add-mention');
    this.$el.on('submit', this.submit.bind(this));
    this.$textarea.on('input', this.updateCounter.bind(this));
    this.$addMentionButton.on('click', this.newUserSelect.bind(this));
    $(this.$el.find('.mentions')).on(
      'click',
      '.remove-mention',
      this.removeMentionedUser.bind(this)
    );
    this.updateCounter();
  }

  submit(e) {
    e.preventDefault();
    const formData = this.$el.serializeJSON();
    console.log(formData);
    // disables all inputs while we try to add to DB
    this.$el.find(':input').prop('disabled', true);
    // sends form data to ajax call
    APIUtil.createTweet(formData)
      .then(data => {
        this.handleSuccess(data);
      })
      .fail(err => {
        this.$el.find(':input').prop('disabled', false);
        console.log(err);
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

  newUserSelect(e) {
    e.preventDefault();
    const $removeMention = $('<a>')
      .attr('href', '#')
      .text('--Remove mention--')
      .addClass('remove-mention');
    const $mentionDiv = $('<div>');
    const $select = $('<select>').attr('name', 'tweet[mentioned_user_ids][]');
    const $mentionList = $(`.mentions`);
    window.users.forEach(user => {
      $($mentionDiv).append(
        $select.append(
          $('<option>')
            .attr('value', user.id)
            .html(user.username)
        )
      );
    });
    $('.feed-form').css('height', '+=35px');
    $mentionDiv.append($removeMention);
    $mentionDiv.appendTo($mentionList);
  }

  removeMentionedUser(e) {
    e.preventDefault();
    $(e.currentTarget)
      .parent()
      .remove();
    $('.feed-form').css('height', '-=35px');
  }
}

module.exports = TweetCompose;
