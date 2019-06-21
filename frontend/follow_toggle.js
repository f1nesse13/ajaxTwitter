class FollowToggle {
  constructor($el) {
    this.$el = $el;
    this.userId = $(this.$el).attr('data-user-id');
    this.followState = $(this.$el).attr('data-initial-follow-state');
    this.render();
    $(this.$el).on('click', this.handleClick.bind(this));
  }

  render() {
    if (this.followState === 'true') {
      this.$el.innerHTML = 'Unfollow!';
    } else {
      this.$el.innerHTML = 'Follow!';
    }
  }

  handleClick(e) {
    e.preventDefault();
    const reqMethod = this.followState === 'true' ? 'DELETE' : 'POST';
    $.ajax({
      method: reqMethod,
      url: `${this.userId}/follow`,
      dataType: 'json',
      success: function(data) {
        this.followState = reqMethod === 'DELETE' ? 'false' : 'true';
        this.render();
      }.bind(this)
    });
  }
}
module.exports = FollowToggle;
