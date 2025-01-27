# Xenon: Static HTML Components in 650 Bytes

Xenon is a small library that implements declarative, reusable components into vanilla HTML, with no user-side javascript or build step.

The entire library uses exactly 648 bytes of javascript.

## Motivation

Take, for the sake of example, [my own personal portfolio website](https://alfiot.net).

Besides a little easter egg that couldn't be done using just CSS, it uses precisely 4 lines of javascript to insert my correct age.

Although I love using JS frameworks for web apps, static websites often do not need to implement any sort of reactivity or server-side interaction, and a build step slows down development and adds unnecessary complexity.

However, even a small static webpage like this could benefit from having some sort of reusable component system: my webpage's showcase projects all follow the same exact structure for uniformity, but the markup for each of them has to be defined individually, making them harder to read and maintain. Unfortunately, HTML does not provide any no-JS way to reuse parts of the webpage.

Xenon addresses this issue; an extremely small drop-in library with no dependencies that offers a flexible way to compose easily reusable and maintainable markup.

See the `demo.html` file in this repository to see the library in action, with a recreation of my website's projects page using Xenon components.

## Basic Usage

### Adding to a project

To add Xenon to a HTML document, add the following script tag to the head of the document:
```html
<script defer src="https://cdn.jsdelivr.net/gh/p2js/xenon@latest/xenon.min.js"></script>
```

Alternatively, for faster loading, you can inline Xenon by placing the following script into your document:
```html
<script defer>
// https://github.com/p2js/xenon
(()=>{let e=e=>{let t=e.getAttribute("_");e.removeAttribute("_"),document.querySelectorAll(t).forEach((t=>{let r=e.innerHTML;for(let l of e.getAttributeNames()){let o=t.getAttribute(l)||e.getAttribute(l);r=r.replaceAll("{"+l+"}",o)}r=r.replaceAll("{$children}",t.innerHTML),t.innerHTML=r,t.querySelectorAll("if").forEach((e=>{e.getAttributeNames().some((e=>t.hasAttribute(e)))?e.replaceWith(...e.childNodes):e.remove()})),t.outerHTML=t.innerHTML}))};document.querySelectorAll("template[_]").forEach(e),document.querySelectorAll("iframe.template-import").forEach((t=>{t.onload=()=>t.contentDocument.querySelectorAll("template[_]").forEach(e)}))})();
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

Then, just add an element with the specified name, and it will be transformed into the template's inner HTML when the document loads:
```html
<greeting></greeting> <!-- Will render as: <p>Hello, World!</p> -->
```

### Attributes

In your template declaration, you can add any parameters you want by passing them as parameters to the template element, optionally assigning a default value to them.

Parameters can be referenced by inserting their name in curly braces. They can be used to insert values in text or attribute names/values:

```html
<template _="joke" noun wink="<i>;)</i>">
    <p>So you're telling me a {noun} fried this rice?</p>
    {wink}
</template>

<joke noun="shrimp"></joke>
<!-- Will render as: <p>So you're telling me a shrimp fried this rice?</p> <i>;)</i> -->
```

### Component children

Any instance of `{$children}` inside a component template will be replaced with the component instances' inner HTML:
```html
<template _="double">
    {$children}
    {$children}
</template>

<double>
    <p>Am I seeing double?</p> 
</double>
<!-- Will render as: <p>Am I seeing double?</p> <p>Am I seeing double?</p> -->
```

### Conditional rendering

Sometimes, it's useful to want to only display something if an instance includes an attribute, such as a summary component that only shows a thumbnail if the instance provides a source link.

To do this, use an `<if>` element inside your template, passing the attribute that needs to be included as an attribute:
```html
<template _="conditional" name>
    <if name>
        <p>You're here, {name}!</p>
    </if>
</template>
```
These elements will render their inner HTML if one of the provided parameters is present in the element (acting as logical OR), otherwise rendering nothing:
```html
<conditional name="HTML lover"></conditional> 
<!-- Renders as: <p>You're here, HTML Lover!</p> -->

<conditional></conditional>                   
<!-- Renders nothing -->
```
If blocks can be nested to act as logical AND.

## Template imports

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
You can then import templates, either from a local file or from anywhere on the web, using an `iframe` element with its `class` attribute set to `template-import`. They can be used just like inline templates, and will render once the iframes load:
```html
<iframe hidden class="template-import" src="speech.template.html"></iframe>

<speech say="Ahoy there!"></speech> <!--Will render once loaded!-->
```
