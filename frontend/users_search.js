const APIUtil = require('./api_util.js');
const FollowToggle = require('./follow_toggle.js');

class UsersSearch {
  constructor($el) {
    this.$el = $($el);
    this.$searchField = this.$el.find('.search-field');
    this.$userList = this.$el.find('.users');
    $(this.$searchField).on('keyup', this.handleKeypress.bind(this));
  }

  handleKeypress(e) {
    APIUtil.searchUsers(inputVal).then(users => {
      this.generateUsers(users);
    });
  }

  generateUsers(users) {
    this.$userList.empty();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const $a = $('<a>');

      $a.text(user.username);
      $a.attr('href', `/users/${user.id}/`);

      const $li = '<li>';
      $li.append($a);

      this.$userList.append($li);
    }
  }
}

module.exports = UsersSearch;
