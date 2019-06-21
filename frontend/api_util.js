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
  }
};

module.exports = APIUtil;
