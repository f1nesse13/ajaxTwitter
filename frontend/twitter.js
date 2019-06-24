const FollowToggle = require('./follow_toggle.js');
const UsersSearch = require('./users_search.js');
const TweetCompose = require('./tweet_compose.js');

$(() => {
  // creates a FollowToggle instance for each .follow-toggle button
  $('.follow-toggle').each(function(i, ele) {
    new FollowToggle(ele);
  });
  $('.users-search').each(function(i, ele) {
    new UsersSearch(ele);
  });
  $('.tweet-compose').each(function(i, ele) {
    new TweetCompose(ele);
  });
});
