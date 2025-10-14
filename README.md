# Experimental 500B Rewrite

This branch contains a rewrite of xenon that maintains all functionality but minifies to under 0.5KB (exactly 493 bytes). It uses several code-golfing techniques to achieve this reduced size:

- Several property accessors (such as `innerHTML`) were redefined as string variables, which can then be used to access that property on objects using indexing:

```js
a.innerHTML = /*...*/;
// vs ...
i = "innerHTML"; // Only defined once, saves space several times!
a[i] = /*...*/;      
```

- The attribute replacing was changed from a concatenated string to a template string.

- the first variable (forAll) is passed as the argument to the function to save declaration space

## Notes

All of these techniques provide a significant sacrifice to legibility so they will not be implemented into the main branch (particularly the latter 2 as they save a combined 2 bytes).