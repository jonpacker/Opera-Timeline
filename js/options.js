var vm; //knockout view model
var loadTimelineOptions = function(undefined) {
	var store = widget.preferences;
	var oauthOpts = {
		consumerKey: 'QrFCcnmv125hev0GM7UflQ',
		consumerSecret: 'l4FYd16ipfInGVIypcvX9x8YePXEYG7QzgWN558p0Q8',
		requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
		accessTokenUrl: 'https://api.twitter.com/oauth/access_token',
		authorizationUrl: 'https://api.twitter.com/oauth/authorize'
	};
	var oauth = OAuth(oauthOpts);
	
	var showTwitterAccessRequest = function() {
		console.log('Initiating twitter request...');
		
		oauth.fetchRequestToken(function(url) {
			var popupSpecs = 'width=800,height=600,resizable=no'
			var windowObjectReference = window.open(url, 'Authorise', popupSpecs);
		}, function(data) {
			console.log(data);
		})
	};
	
	var saveTwitterAccessToken = function(pin) {
		oauth.get(oauthOpts.accessTokenUrl + '?oauth_verifier=' + pin, 
		function(data) {
			var response = QueryString.parse(data.text);
			vm.accessTokenSet([response.oauth_token, response.oauth_token_secret]);
		}, 
		function(data) {
			// TODO - handle unsuccessful auth
		});
	}
	
	var handleKeySave = function(e) {
		var pinInput = document.getElementById('twitterAccessKey');
		var pin = pinInput.textContent;
		saveTwitterAccessToken(pin);
	}

	var forgetUser = function(e) {
		vm.accessToken('none');
	}
	
	var handleKeyReq = showTwitterAccessRequest;
	
	var saveAccessKeyButton = document.getElementById('twitterSaveAccessKey');
	var reqAccessKeyButton = document.getElementById('twitterRequestAccessKey');
	var unsaveUserButton = document.getElementById('unsaveUser');
	
	saveAccessKeyButton.addEventListener('click', handleKeySave, false);
	reqAccessKeyButton.addEventListener('click', handleKeyReq, false);
	unsaveUserButton.addEventListener('click', forgetUser, false);

	vm = {
		widget: widget,
		accessToken: ko.observable(store.accessToken),
		updateInterval: ko.observable(store.updateInterval || '15')
	}

	vm.updateInterval.subscribe(function(newValue) {
		store.updateInterval = newValue;
	});

	vm.accessToken.subscribe(function(newValue) {
		store.accessToken = newValue;
	});

	vm.authd = ko.dependentObservable(function() {
		return this.accessToken() != 'none';
	}, vm);

	vm.accessTokenSet = ko.dependentObservable({
		read: function() {
			if (this.authd()) {
				return this.accessToken().split('|');
			} else {
				return this.accessToken();
			}
		},
		write: function(value) {
			this.accessToken(value.join('|'));
		},
		owner: vm
	});
	ko.applyBindings(vm);
};

window.addEventListener('DOMContentLoaded', function() {
	loadTimelineOptions();
}, false);