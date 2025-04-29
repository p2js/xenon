# Experimental Component Scripting

This branch experiments with adding a script execution feature to xenon components while keeping within the size restrictions.

Note that the code is significantly less legible, and required a dedicated terser-based minifying script to mangle only the correct variable names (build using `pnpm build`).

## Component scripts

Add a script tag to a component template, and it will be executed inside each instance; address the instances themselves by using the `instance` variable.
The script element's HTML will get replaced with the value of the final expression in the script (which in the case of the example below is the last reference to `out` in the loop):

```html
    <template _="list" quantity>
        <p>No quantity specified!</p>
        <if quantity>
            <p>Listing {quantity} items:</p>
            <script>
                instance.children[0].remove();
                let out = "";
                for (let i = 1; i <= +"{quantity}"; i++) {
                    out += `<p>${i}</p>`;
                }
            </script>
        </if>
    </template>
```

```html
<list></list>
<!-- Renders: <p>No quantity specified!</p>-->

<list quantity="2"></list>
<!-- Renders: <p>Listing 2 items:</p><p>1</p><p>2</p>-->
```

Template attributes referenced in curly braces will get replaced before the script executes. Because of this, exercise caution when referencing variables with the same name as parameters in the template script, particularly in objects and template literals.

## Notes

This is likely not going to be implemented in the main version of xenon for the following reasons:

- Developement complexity is increased by requiring node and terser for the custom minification
- The feature kind of defeats the whole point of being a "No user-facing JavaScript" tool; If a web app requires a component complex enough to need programming, you can probably write the whole logic for it in a web component without using xenon, or bring in an actual component framework.

However, this component scripting does serve as a much more concise way of expressing component behaviour relative to web components. It's also more flexible due to the lack of naming restrictions.