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
        this.$el.find(':input').prop('disabled', false);
        console.log(err);
      });
  }

  clearInput() {
    this.$el.find('textarea').val('');
    this.$el.find('select').val('');
  }

  handleSuccess(data) {
    this.$el.find(':input').prop('disabled', false);
    this.clearInput();
    const $ul = $(this.$el.attr('data-tweets-ul'));
    const $li = $('<li></li>');
    $ul.prepend($li.append(JSON.stringify(data)));
  }

  updateCounter() {
    const $textarea = this.$el.find('textarea');
    const $counter = this.$el.find('.chars-left');
    let charsLeft = $($textarea).val().length;
    $($counter).text('');
    $($counter).text(`${charsLeft}/140`);
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
    const $removeMention = $('<a>')
      .attr('href', '#')
      .text('--Remove mention--')
      .addClass('remove-mention');
    const $mentionDiv = $('<div>');
    const $select = $('<select>').attr('name', 'tweet[mentioned_user_ids][]');
    const $mentionList = $(`.mentions`);
    window.users.forEach(user => {
      $($mentionDiv).append(
        $select.append(
          $('<option>')
            .attr('value', user.id)
            .html(user.username)
        )
      );
    });
    $('.feed-form').css('height', '+=35px');
    $mentionDiv.append($removeMention);
    $mentionDiv.appendTo($mentionList);
  }

  removeMentionedUser(e) {
    e.preventDefault();
    $(e.currentTarget)
      .parent()
      .remove();
    $('.feed-form').css('height', '-=35px');
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