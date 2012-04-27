@import <Foundation/Foundation.j>
@import <Timeline.j>

function main() {
  var output = document.querySelector('.output');
  var preferences = widget.preferences;
  var oauth = OAuth({
		consumerKey: 'QrFCcnmv125hev0GM7UflQ',
		consumerSecret: 'l4FYd16ipfInGVIypcvX9x8YePXEYG7QzgWN558p0Q8'
	});

  var timeline = [[Timeline alloc] initWithOutputElement:output
                                             preferences:preferences
                                          authentication:twitterAuth];
}
