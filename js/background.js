window._log = (function() {
  allLogs = [];

  function addLog() {
    var args = Array.prototype.slice.apply(arguments);
    allLogs.push(args);
  }

  addLog.getLogs = function() {
    return allLogs;
  }

  return addLog;
})()

window.addEventListener('DOMContentLoaded', function() {
	var output = document.querySelector('.output');
	var store = widget.preferences;
	var oauth = OAuth({
		consumerKey: 'QrFCcnmv125hev0GM7UflQ',
		consumerSecret: 'l4FYd16ipfInGVIypcvX9x8YePXEYG7QzgWN558p0Q8'
	});
	
	function notAuthd() {
		output.innerHTML = '<h1 class="error">Click this tile to set up your twitter account.</h1>';
		opera.contexts.speeddial.url = '/options.html';
	}

	// no access
	if (store.accessToken == 'none' || !store.accessToken) {
		notAuthd();
	}
	
	var tweetTemplate = document.getElementById('tweetTmpl').innerHTML;
	
	function currentTopTweetText() {
		var topTweetText = document.querySelector('.text');
		if (!topTweetText) {
			return '';
		} else {
			return topTweetText.textContent;
		}
	}

	function assembleTweet(data) {
		var tweet = tweetTemplate + '';
		tweet = tweet.replace(/:name/, data.user.screen_name);
		tweet = tweet.replace(/:text/, data.text);
		tweet = tweet.replace(/:icon/, data.user.profile_image_url);
		return tweet;
	}
	
	function updateTimeline(data) {
		if (!data.length || data.length < 1) {
			return;
		}

		if (data[0].text == currentTopTweetText()) {
			return; //nothing new, bail here.
		}

		var htmlBuffer = '';
		for (var i = 0; i < data.length || i < 12; ++i) {
			htmlBuffer += assembleTweet(data[i]);
		}
		output.innerHTML = htmlBuffer;
	}
	
	function handleTimelineUpdateFailure(data) {
	}

  function requestJSON(url, complete, failure) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status != 200) {
          failure();
        } else {
          complete(JSON.parse(xhr.responseText));
        }
      }
    }
  }
	
	function requestTimelineUpdate() {
    if (store.timelineType === 'user') {
      var url = 'http://twitter.com/statuses/user_timeline/' + store.userValue + '.json';
      requestJSON(url, updateTimeline, handleTimelineUpdateFailure);
    } else if (store.timelineType === 'list') {
      var url = 'http://api.twitter.com/1/lists/statuses.json?slug=' + store.listName + '&owner_screen_name=' + store.curator;
      requestJSON(url, updateTimeline, handleTimelineUpdateFailure);
    } else if (store.accessToken != 'none' && !!store.accessToken) {
			opera.contexts.speeddial.url = 'http://www.twitter.com';
			oauth.setAccessToken(store.accessToken.split('|'));
			oauth.getJSON('http://api.twitter.com/1/statuses/home_timeline.json',
				updateTimeline, handleTimelineUpdateFailure);
		} else {
			notAuthd();
		}
	}
	
	requestTimelineUpdate();
	
	//now lets update it every 10 secs.
	window.setInterval(function() {
		requestTimelineUpdate();
	}, store.updateInterval * 1000);
	
}, false);
