/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/twitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/api_util.js":
/*!******************************!*\
  !*** ./frontend/api_util.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./frontend/follow_toggle.js":
/*!***********************************!*\
  !*** ./frontend/follow_toggle.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js");

class FollowToggle {
  constructor($el, options) {
    this.$el = $el;
    this.userId = $(this.$el).attr('data-user-id') || options.userId;
    this.followState =
      $(this.$el).attr('data-initial-follow-state') === 'true'
        ? 'followed'
        : 'unfollowed' || false;
    this.render();
    $(this.$el).on('click', this.handleClick.bind(this));
  }

  render() {
    console.log(this.followState);
    if (this.followState === 'followed') {
      $(this.$el).html('Unfollow!');
    } else if (this.followState === 'unfollowed') {
      $(this.$el).html('Follow!');
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
      // disables button until ajax call completes
      this.followState = 'unfollowing';
      this.render();
      APIUtil.unfollowUser(this.userId).then(data => {
        // sets follow state and rerenders
        this.followState = 'unfollowed';
        this.render();
      });
    } else {
      // disables button until ajax call responds
      this.followState = 'following';
      this.render();
      APIUtil.followUser(this.userId).then(data => {
        // sets follow state and rerenders
        this.followState = 'followed';
        this.render();
      });
    }
  }
}
module.exports = FollowToggle;


/***/ }),

/***/ "./frontend/infinite_tweets.js":
/*!*************************************!*\
  !*** ./frontend/infinite_tweets.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable class-methods-use-this */
const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js");

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


/***/ }),

/***/ "./frontend/tweet_compose.js":
/*!***********************************!*\
  !*** ./frontend/tweet_compose.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable class-methods-use-this */
const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js");

class TweetCompose {
  constructor($el) {
    this.$el = $($el);
    this.$textarea = $(this.$el.find('textarea'));
    this.$addMentionButton = this.$el.find('.mentions .add-mention');
    this.$el.on('submit', this.submit.bind(this));
    this.$textarea.on('input', this.updateCounter.bind(this));
    this.$addMentionButton.on('click', this.newUserSelect.bind(this));
    $(this.$el.find('.mentions')).on(
      'click',
      '.remove-mention',
      this.removeMentionedUser.bind(this)
    );
    this.updateCounter();
  }

  submit(e) {
    e.preventDefault();
    const formData = this.$el.serializeJSON();
    console.log(formData);
    // disables all inputs while we try to add to DB
    this.$el.find(':input').prop('disabled', true);
    // sends form data to ajax call
    APIUtil.createTweet(formData)
      .then(data => {
        this.handleSuccess(data);
      })
      .fail(err => {
        // disables the disabled prop so a user can fix any mistakes - does not clear input so user will not lose progress - logs the error for dev purposes
        this.$el.find(':input').prop('disabled', false);
        console.log(err);
      });
  }

  clearInput() {
    // clears input fields
    this.$el.find('textarea').val('');
    this.$el.find('select').val('');
  }

  handleSuccess(data) {
    // disables the disabled property clears our input fields and prepends the new li to the list of tweets
    this.$el.find(':input').prop('disabled', false);
    this.clearInput();
    $('#feed-messages-list').trigger('insert-tweet', data);
    // const $ul = $(this.$el.attr('data-tweets-ul'));
    // const $li = $('<li></li>');
    // $ul.prepend($li.append(JSON.stringify(data)));
  }

  updateCounter() {
    // grab textarea and the counter
    const $textarea = this.$el.find('textarea');
    const $counter = this.$el.find('.chars-left');
    // counts characters inside textarea
    let charsLeft = $($textarea).val().length;
    // resets the character count for each input event
    $($counter).text('');
    $($counter).text(`${charsLeft}/140`);
    // if the user hits 140 or more characters we will keep setting the first 140 chars using substring and insert them essentially stopping a user from adding more
    if (charsLeft >= 140) {
      $($textarea).val(
        $($textarea)
          .val()
          .substring(0, 139)
      );
    }
  }

  newUserSelect(e) {
    e.preventDefault();
    // link used to remove this mention field
    const $removeMention = $('<a>')
      .attr('href', '#')
      .text('--Remove mention--')
      .addClass('remove-mention');
    // parent div that contains all elements of a added mention field
    const $mentionDiv = $('<div>');
    const $select = $('<select>').attr('name', 'tweet[mentioned_user_ids][]');
    // parent of our container - holds all divs with seperate selects for mentions along with link to remove
    const $mentionList = $(`.mentions`);
    // generates a new select field with options to choose each user - users stored in window.users global variable
    window.users.forEach(user => {
      $($mentionDiv).append(
        $select.append(
          $('<option>')
            .attr('value', user.id)
            .html(user.username)
        )
      );
    });
    // adds 53px of height to account for the 53px container div (<select> with <a> tag to remove the select)
    $('.feed-form').css('height', '+=53px');
    $mentionDiv.append($removeMention);
    $mentionDiv.appendTo($mentionList);
  }

  removeMentionedUser(e) {
    // removes a div containing our generated select field and removal link
    e.preventDefault();
    // listens on parent .mentions and targets .remove-mention's parent element which is the generated div
    $(e.currentTarget)
      .parent()
      .remove();
    // reduces the size of the form that is added when we add a new mention field
    $('.feed-form').css('height', '-=53px');
  }
}

module.exports = TweetCompose;


/***/ }),

/***/ "./frontend/twitter.js":
/*!*****************************!*\
  !*** ./frontend/twitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(/*! ./follow_toggle.js */ "./frontend/follow_toggle.js");
const UsersSearch = __webpack_require__(/*! ./users_search.js */ "./frontend/users_search.js");
const TweetCompose = __webpack_require__(/*! ./tweet_compose.js */ "./frontend/tweet_compose.js");
const InfiniteTweets = __webpack_require__(/*! ./infinite_tweets.js */ "./frontend/infinite_tweets.js");

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
  $('.infinite-tweets').each(function(i, ele) {
    new InfiniteTweets(ele);
  });
});


/***/ }),

/***/ "./frontend/users_search.js":
/*!**********************************!*\
  !*** ./frontend/users_search.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js");
const FollowToggle = __webpack_require__(/*! ./follow_toggle.js */ "./frontend/follow_toggle.js");

class UsersSearch {
  constructor($el) {
    this.$el = $($el);
    this.$searchField = this.$el.find('input.search-field');
    this.$userList = this.$el.find('ul.users');
    $(this.$searchField).on('keyup', this.handleKeypress.bind(this));
  }

  handleKeypress(e) {
    APIUtil.searchUsers(this.$searchField.val()).then(users => {
      this.generateUsers(users);
    });
  }

  generateUsers(users) {
    this.$userList.empty();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const $a = $('<a></a>');
      $($a).text(`@${user.username}`);
      $($a).attr('href', `/users/${user.id}/`);

      const $li = $('<li></li>');
      const $followToggle = $('<button></button>');

      new FollowToggle($followToggle, {
        userId: user.id,
        followState: user.followed ? 'followed' : 'unfollowed'
      });

      $($li).append($a);
      $($li).append($followToggle);
      this.$userList.append($li);
    }
  }
}

module.exports = UsersSearch;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map