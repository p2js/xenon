# Xenon: Static HTML Components in 600 Bytes

Xenon is a small library that implements reusable components into static HTML; No JavaScript interaction, framework or build step.

The entire library uses exactly 544 bytes of JavaScript.

## Motivation

Take, for the sake of example, [my own personal portfolio website](https://alfiot.net).

Besides a little easter egg that couldn't be done using just CSS, it uses precisely 4 lines of javascript to insert my correct age.

Although I love using JS frameworks for web apps, static websites often do not need to implement any sort of reactivity or server-side interaction, and a build step slows down development and adds unnecessary complexity.

However, even a small static webpage like this could benefit from having some sort of reusable component system: my webpage's showcase projects all follow the same exact structure for uniformity, but the markup for each of them has to be defined individually, making the code harder to read and maintain. Unfortunately, HTML does not provide any no-JS way to reuse fragments of webpages.

Xenon addresses this issue; an extremely small drop-in library with no dependencies that offers a flexible way to compose easily reusable and maintainable markup.

See [my website's repository](https://github.com/p2js/alfiot.net) to see the library in action, as its projects section was rewritten using Xenon.

## Usage Documentation

### Adding to a project

To add Xenon to a HTML document, add the following script tag to the end of the document body:
```html
<script src="https://cdn.jsdelivr.net/gh/p2js/xenon@latest/xenon.min.js"></script>
```

Alternatively, for faster loading, you can inline Xenon by placing the following script into your document:
```html
<script>
// https://github.com/p2js/xenon
(_=>{let l=(e,t,r)=>e?.querySelectorAll(t).forEach(r),r=e=>l(e,"template[_]",o=>{l(document,o.getAttribute("_"),r=>{let t=o.innerHTML;o.getAttributeNames().forEach(e=>"_"!=e&&(t=t.replaceAll("{"+e+"}",r.getAttribute(e)||o.getAttribute(e)))),t=t.replaceAll(/{\$(\S+?)}/g,(e,t)=>r[t].outerHTML||r[t]),r.innerHTML=t,l(r,"if",e=>e.replaceWith(...e.getAttributeNames().some(e=>r.hasAttribute(e))?e.childNodes:[])),r.outerHTML=r.innerHTML}),o.remove()});r(document),l(document,".template-import",t=>t.onload=e=>{r(t.contentDocument),t.remove()})})();
</script>
```
### Declaring/Using component templates

To add a component to a HTML document, start by declaring its template: insert a HTML template element with the `_` attribute set to the component's name:
```html
<template _="greeting">
    <p>Hello, World!</p>
</template>
```
Standard practice is adding them to the head of your HTML, as they are unrendered fragments to be used elsewhere.

Then, just add an element with the specified selector, and it will be transformed into the template's inner HTML when the document loads:
```html
<greeting></greeting> <!-- Will render as: <p>Hello, World!</p> -->
```
*technical note*: You can use any CSS selector in the `_` attribute, eg. `p.x-greeting[name]`, to only transform elements with the specified properties.

### Attributes

In your template declaration, you can add any attributes you want by passing them as attributes to the template element, optionally assigning a default value to them.

Attribute values can be referenced by inserting their name in curly braces. They can be used to insert values in text or anywhere in the inner HTML:
```html
<template _="joke" noun style="color: red">
    <p style="{style}">So you're telling me a {noun} fried this rice?</p>
</template>

<joke noun="<b>shrimp</b>"></joke>
<!-- Will render as: <p style="color: red">So you're telling me a <b>shrimp</b> fried this rice?</p> -->
```

### Instance properties

To access the properties of component instances, such as its inner HTML children, use `{$<property>}` in the component template:
```html
<template _="double">
    {$innerHTML}
    {$innerHTML}
</template>

<double>
    <p>Am I seeing double?</p> 
</double>
<!-- Will render as: <p>Am I seeing double?</p> <p>Am I seeing double?</p> -->
```
If the property refers to an HTML element (such as `{$firstElementChild}` or `{$nextElementSibling}`), it will get correctly stringified using its outer HTML string.

Note that in particular, component children addressed with `{$innerHTML}` can be used to display a partial fallback if the component fails to load (such as when JavaScript is disabled).

### Conditional rendering

Sometimes, it's useful to want to only display something if an instance includes an attribute, such as a summary component that only shows a thumbnail if the instance provides an image URL.

To do this, use an `<if>` element inside your template, passing the attribute that needs to be included as an attribute:
```html
<template _="conditional" name>
    <p>Hi!</p>
    <if name>
        <p>You're here, {name}!</p>
    </if>
</template>
```
These elements will render their inner HTML if one of the provided parameters is present in the element (acting as logical OR), otherwise rendering nothing:
```html
<conditional name="HTML lover"></conditional> 
<!-- Renders as: <p>Hi!</p> <p>You're here, HTML Lover!</p> -->

<conditional></conditional>                   
<!-- Renders as: <p>Hi!</p> -->
```
If blocks can be nested to act as logical AND.

### Template Imports

To share components between files or on the web, or simply store them in their own files, you can use component template imports.

Store any number of components inside a separate HTML file:
```html
<!-- speech.template.html -->
<template _="speech" say><pre>
&lt;{say}&gt;
\
 O
-|-
/ \
</pre></template>
```
You can then import templates, either from a local file or from anywhere on the web, using a frame element with its `class` attribute set to `template-import`. They can be used just like inline templates, and will render once the iframes load:
```html
<iframe hidden class="template-import" src="speech.template.html"></iframe>

<speech say="Ahoy there!"></speech> <!-- Will render once loaded! -->
```