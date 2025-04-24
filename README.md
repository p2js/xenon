# Experimental 500B Rewrite

This branch contains a rewrite of xenon that maintains all functionality but is now under 0.5KB (exactly 496 bytes). It uses several code-golfing techniques to achieve this reduced size:

- Several property accessors (such as `innerHTML`) were redefined as string variables, which can then be used to access that property on objects using indexing:

```js
a.innerHTML = /*...*/;
// vs ...
i = "innerHTML"; // Only defined once, saves space several times!
a[i] = /*...*/;      
```

- The attribute replacing was changed from a concatenated string to a template string.

- The `filter` call for attribute names that aren't `_` was changed to an if statement in the body of the loop.

- the `selectAll` redefinition in the main version was modified to include `forEach` (now called `forAll`).

- the `<if>` block processing was changed to have the condition inside the `replaceWith` function, with removal achieved by calling with a spreaded empty array if the conditions aren't met.

## Notes

Some of this refactoring may make its way onto the main branch eventually. The first two techniques, however, seem like too much of a sacrifice for what ends up being a practically insignificant size reduction (the first in terms of legibility, the second due to saving literally one byte and being slower).