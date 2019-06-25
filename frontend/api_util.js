const APIUtil = {
  followUser: id => {
    return $.ajax({
      method: 'POST',
      url: `/users/${id}/follow`,
      dataType: 'json'
    });
  },
  unfollowUser: id => {
    return $.ajax({
      method: 'DELETE',
      url: `/users/${id}/follow`,
      dataType: 'json'
    });
  },
  searchUsers: query =>
    $.ajax({
      url: '/users/search',
      type: 'GET',
      dataType: 'json',
      data: { query }
    }),
  createTweet: data =>
    $.ajax({
      url: '/tweets',
      type: 'POST',
      dataType: 'json',
      data
    }),
  getTweets: data =>
    $.ajax({
      url: '/feed',
      type: 'GET',
      dataType: 'json',
      data
    })
};

module.exports = APIUtil;
