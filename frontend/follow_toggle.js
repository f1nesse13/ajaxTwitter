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
    } else {
      this.$el.innerHTML = 'Follow!';
    }
  }

  handleClick(e) {
    e.preventDefault();
    const reqMethod = this.followState === 'followed' ? 'DELETE' : 'POST';
    $.ajax({
      method: reqMethod,
      url: `${this.userId}/follow`,
      dataType: 'json',
      success: function(data) {
        this.followState = reqMethod === 'DELETE' ? 'unfollowed' : 'followed';
        this.render();
      }.bind(this)
    });
  }
}
module.exports = FollowToggle;
