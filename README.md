# Experimental Component Scripting

This branch experiments with adding a script execution feature to xenon components while keeping within the size restrictions.

Note that the code is significantly more unreadable, and required switching to a local terser-based minifying script to mangle only the correct variable names.

## Component scripts

Add a script tag to a component template, and it will be executed inside each instance; address the instances themselves by using the `instance` variable.

```html
<template _="list" quantity>
    <if quantity>
        <p>Listing {quantity} items:</p>
        <script>
            let quantity = {quantity};
            for (let i = 1; i <= quantity; i++) {
                let p = document.createElement("p");
                p.innerText = i;
                instance.appendChild(p);
            }
        </script>
    </if>
</template>
```

```html
<list quantity="2"></list>
<!-- Renders: <p>Listing 2 items:</p><p>1</p><p>2</p>-->
```

Template attributes referenced in curly braces will get replaced before the script executes.

## Notes

This is likely not going to be implemented in the main version of xenon for the following reasons:

- Developement complexity is exponentially increased by requiring node and terser for the custom minification
- The feature kind of defeats the whole point of being a "No user-facing JavaScript" tool; If a web app requires a component complex enough to need programming, you can probably write the whole logic for it in a script without using xenon, or bring in an actual component framework.