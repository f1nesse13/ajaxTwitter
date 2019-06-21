class FollowToggle {
  constructor($el) {
    this.$el = $($el);
    this.userId = this.$el.attr('data-user-id');
    this.followState = this.$el.attr('data-initial-follow-state');
  }
}

module.exports = FollowToggle;
