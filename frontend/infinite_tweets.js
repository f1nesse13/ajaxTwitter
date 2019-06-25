/* eslint-disable class-methods-use-this */
const APIUtil = require('./api_util.js');

class InfiniteTweets {
  constructor($el) {
    this.$el = $($el);
    this.lastCreatedAt = null;
    $(this.$el).on('click', '.fetch-tweets', this.fetchTweets.bind(this));
    $(this.$el).on('insert-tweet', this.insertTweet.bind(this));
  }

  fetchTweets(e) {
    e.preventDefault();
    const that = this;
    const data = {};
    if (this.lastCreatedAt) {
      data.max_created_at = this.lastCreatedAt;
    }
    APIUtil.getTweets(data).then(res => {
      that.insertTweets(res);

      if (res.length < 20) {
        that.$el.find('.fetch-tweets').replaceWith("<b class='replace-link'> No more tweets </b>");
      }
      if (res.length > 0) {
        that.lastCreatedAt = res[res.length - 1].created_at;
      }
    });
  }

  insertTweets(data) {
    // console.log(data);
    const $ul = this.$el.find('ul#feed-messages-list');
    $($ul).append(data.map(this.createTweet));
    $('.hide')
      .removeClass('hide')
      .addClass('fetch-tweets');
  }

  insertTweet(event, data) {
    const $ul = this.$el.find('ul#feed-messages-list');
    $($ul).prepend(this.createTweet(data));

    if (!this.lastCreatedAt) this.lastCreatedAt = data.created_at;
  }

  createTweet(tweet) {
    // Grab all mentions
    const mentions = tweet.mentions
      .map(
        mention =>
          `<li>
        <a href='/users/${mention.user.id}'>@${mention.user.username}</a>
        </li>`
      )
      .join('');
    // creates two possible strings for output - removing the Mentions: paragraph element if no mentions are present
    const tweetWithMention = `<div class='tweet'>
      <a href='/users/${tweet.user.id}'>${tweet.user.username}</a>
      <p>${tweet.content}</p>
      <small>${tweet.created_at}</small>
      <ul>
      <p>Mentions:</p>
      ${mentions}</ul>`;
    const tweetWithoutMention = `<div class='tweet'>
      <a href='/users/${tweet.user.id}'>${tweet.user.username}</a>
      <p>${tweet.content}</p>
      <small>${tweet.created_at}</small>
      <ul>
      ${mentions}</ul>`;

    const tweetDiv = mentions.length > 0 ? tweetWithMention : tweetWithoutMention;
    return $(tweetDiv);
  }
}

module.exports = InfiniteTweets;
