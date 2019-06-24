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
        // disables the disabled prop so a user can fix any mistakes - does not clear input so user will not lose progress - logs the error for dev purposes
        this.$el.find(':input').prop('disabled', false);
        console.log(err);
      });
  }

  clearInput() {
    // clears input fields
    this.$el.find('textarea').val('');
    this.$el.find('select').val('');
  }

  handleSuccess(data) {
    // disables the disabled property clears our input fields and prepends the new li to the list of tweets
    this.$el.find(':input').prop('disabled', false);
    this.clearInput();
    const $ul = $(this.$el.attr('data-tweets-ul'));
    const $li = $('<li></li>');
    $ul.prepend($li.append(JSON.stringify(data)));
  }

  updateCounter() {
    // grab textarea and the counter
    const $textarea = this.$el.find('textarea');
    const $counter = this.$el.find('.chars-left');
    // counts characters inside textarea
    let charsLeft = $($textarea).val().length;
    // resets the character count for each input event
    $($counter).text('');
    $($counter).text(`${charsLeft}/140`);
    // if the user hits 140 or more characters we will keep setting the first 140 chars using substring and insert them essentially stopping a user from adding more
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
    // link used to remove this mention field
    const $removeMention = $('<a>')
      .attr('href', '#')
      .text('--Remove mention--')
      .addClass('remove-mention');
    // parent div that contains all elements of a added mention field
    const $mentionDiv = $('<div>');
    const $select = $('<select>').attr('name', 'tweet[mentioned_user_ids][]');
    // parent of our container - holds all divs with seperate selects for mentions along with link to remove
    const $mentionList = $(`.mentions`);
    // generates a new select field with options to choose each user - users stored in window.users global variable
    window.users.forEach(user => {
      $($mentionDiv).append(
        $select.append(
          $('<option>')
            .attr('value', user.id)
            .html(user.username)
        )
      );
    });
    // adds 53px of height to account for the 53px container div (<select> with <a> tag to remove the select)
    $('.feed-form').css('height', '+=53px');
    $mentionDiv.append($removeMention);
    $mentionDiv.appendTo($mentionList);
  }

  removeMentionedUser(e) {
    // removes a div containing our generated select field and removal link
    e.preventDefault();
    // listens on parent .mentions and targets .remove-mention's parent element which is the generated div
    $(e.currentTarget)
      .parent()
      .remove();
    // reduces the size of the form that is added when we add a new mention field
    $('.feed-form').css('height', '-=53px');
  }
}

module.exports = TweetCompose;
