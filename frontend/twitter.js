const FollowToggle = require('./follow_toggle.js');
const UsersSearch = require('./users_search.js');

$(() => {
  // creates a FollowToggle instance for each .follow-toggle button
  $('.follow-toggle').each(function(i, ele) {
    new FollowToggle(ele);
  });
  $('.users-search').each(function(i, ele) {
    new UsersSearch(ele);
  });
});
