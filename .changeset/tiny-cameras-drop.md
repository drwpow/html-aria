---
"html-aria": minor
---

⚠️ Breaking change: Node API now requires all attributes.

**Attributes**

In the previous version, `<a>` and `<area>` would assume `href` was set, unless you passed in an explicit `attributes: {}` object. However, in expanding the DOM API this inconsistency in behavior led to problems. Now both versions behave the same way in regards to attributes: an attribute is assumed **NOT** to exist unless passed in.

**Ancestors**

This behavior is largely-unchanged, however, some small improvements have been made.

_Note: the DOM version will automatically traverse the DOM for you, and automatically reads all attributes. This change only affects the Node API where the DOM is unavailable._
