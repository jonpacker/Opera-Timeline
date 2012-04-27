@implementation Timeline : CPObject {
  @private
    // The element to output to.
    Element outputElement;

    // The preferences object to read from
    Object preferences;

    // The twitter auth details to use
    Object twitterAuth;
}

- (id) initWithOutputElement:(Element)element
                 preferences:(Object)preferences
              authentication:(Object)authentication {
  outputElement = element;
  preferences = preferences;
  twitterAuth = authentication;
}

@end
