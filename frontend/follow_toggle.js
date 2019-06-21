const APIUtil = require('./api_util.js');

class FollowToggle {
  constructor($el) {
    this.$el = $el;
    this.userId = $(this.$el).attr('data-user-id');
    this.followState =
      $(this.$el).attr('data-initial-follow-state') === 'true' ? 'followed' : 'unfollowed';
    this.render();
    $(this.$el).on('click', this.handleClick.bind(this));
  }

  render() {
    if (this.followState === 'followed') {
      this.$el.innerHTML = 'Unfollow!';
    } else if (this.followState === 'unfollowed') {
      this.$el.innerHTML = 'Follow!';
    }
    if (this.followState === 'following' || this.followState === 'unfollowing') {
      $(this.$el).prop('disabled', true);
    } else {
      $(this.$el).prop('disabled', false);
    }
  }

  handleClick(e) {
    e.preventDefault();
    if (this.followState === 'followed') {
      this.followState = 'unfollowing';
      this.render();
      APIUtil.unfollowUser(this.userId).then(data => {
        this.followState = 'unfollowed';
        this.render();
      });
    } else {
      this.followState = 'following';
      this.render();
      APIUtil.followUser(this.userId).then(data => {
        this.followState = 'followed';
        this.render();
      });
    }
    // $.ajax({
    //   method: reqMethod,
    //   url: `${this.userId}/follow`,
    //   dataType: 'json',
    //   success: function(data) {
    //     this.followState = reqMethod === 'DELETE' ? 'unfollowed' : 'followed';
    //     this.render();
    //   }.bind(this)
    // });
  }
}
module.exports = FollowToggle;
