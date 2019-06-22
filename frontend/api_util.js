const APIUtil = {
  followUser: id => {
    return $.ajax({
      method: 'POST',
      url: `${id}/follow`,
      dataType: 'json'
    });
  },
  unfollowUser: id => {
    return $.ajax({
      method: 'DELETE',
      url: `${id}/follow`,
      dataType: 'json'
    });
  },
  searchUsers: query =>
    $.ajax({
      url: '/users/search',
      type: 'GET',
      dataType: 'json',
      data: { query }
    })
};

module.exports = APIUtil;
