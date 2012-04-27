@implementation Timeline : CPObject {
  // The element to output to.
  Element outputElement;

  // The preferences object to read from
  Object preferences;

  // The twitter auth details to use
  Object twitterAuth;

  // Template with which to generate a tweet.
  String tweetTemplate;
}

- (id) initWithOutputElement:(Element)element
                 preferences:(Object)preferences
              authentication:(Object)authentication {
  if (self = [super init]) {
    outputElement = element;
    preferences = preferences;
    [self initTemplate];
    [self authenticateWithAuthentication:authentication];
  }
  
  return self;
}

- (void) userCouldNotAuthenticate {
  [self setOutputHtml:'<h1 class="error">Click this tile to set up your ' + 
                      'twitter account.</h1>'];
  opera.contexts.speeddial.url = '/options.html';
}

- (void) initTemplate {
  // Needs some way of being created by the user. Add into init?
  tweetTemplate = document.getElementById('tweetTmpl').innerHTML;
}

- (void) authenticateWithAuthentication:(Object)authentication {
  twitterAuth = OAuth(authentication);
  
  if (preferences.accessToken === 'none' || !preferences.accessToken) {
    [self userCouldNotAuthenticate];
  }
}

- (void) setOutputHtml:(String)html {
  outputElement.innerHTML = html;
}


@end
