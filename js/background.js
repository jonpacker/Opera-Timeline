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
  var rep; //variable to set the repeat interval
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
    console.log('Error: '+data);
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
    var authd = true;
    if (store.timelineType === 'user') {
      //var url = 'http://twitter.com/statuses/user_timeline/' + store.userValue + '.json';
      var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+store.userValue+'&count=12';
      requestJSON(url, updateTimeline, handleTimelineUpdateFailure);
    } else if (store.timelineType === 'list') {
      //var url = 'http://api.twitter.com/1/lists/statuses.json?slug=' + store.listName + '&owner_screen_name=' + store.curator;
      var url = 'https://api.twitter.com/1.1/lists/statuses.json?slug='+store.listName+'&owner_screen_name='+store.curator+'&count=12';
      requestJSON(url, updateTimeline, handleTimelineUpdateFailure);
    } else if (store.accessToken != 'none' && !!store.accessToken) {
      //opera.contexts.speeddial.url = 'http://www.twitter.com';
      opera.contexts.speeddial.url = 'https://www.twitter.com';
			oauth.setAccessToken(store.accessToken.split('|'));
			//oauth.getJSON('http://api.twitter.com/1/statuses/home_timeline.json',
      oauth.getJSON('https://api.twitter.com/1.1/statuses/home_timeline.json',
				updateTimeline, handleTimelineUpdateFailure);
		} else {
      authd = false;
			notAuthd();
  	}
    //this is needed because if you change the interval in the options page
    //the interval needs to be reset and before it didn't
    rep = window.clearInterval(rep); //clear the interval
    rep = window.setInterval(function() { //set the new interval
      requestTimelineUpdate();
    //if not authenticated call it every 10 seconds
    //else every time indicated by the parameter
    }, (authd ? store.updateInterval* 60000 : 10000));
	}

	requestTimelineUpdate();

}, false);
