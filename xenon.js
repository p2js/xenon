(_ => {
    // Redefinitions to minify every other call to a single letter
    let forAll = (element, selector, fn) => element.querySelectorAll(selector).forEach(fn);
    let getAttribute = (element, attributeName) => element.getAttribute(attributeName);
    let htmlDocument = document;

    // Process a document's component templates and apply them to the current document
    let processTemplates = doc => forAll(doc, "template[_]", template => {
        // Select all elements in the current document with the name specified in the attribute
        forAll(htmlDocument, getAttribute(template, "_"), componentInstance => {
            // Process the template HTML
            let instanceHTML = template.innerHTML;
            // Redefine instance (as separate non-mangled variable to be used by eval)
            let instance = componentInstance;

            for (let attributeName of template.getAttributeNames()) {
                // replace all appearances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                if (attributeName != "_") {
                    instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}",
                        getAttribute(componentInstance, attributeName) || getAttribute(template, attributeName));
                }
            }

            // Replace all appearances of {$children} with the instance's HTML
            instanceHTML = instanceHTML.replaceAll("{$children}", componentInstance.innerHTML);

            // Place the processed HTML inside the instance 
            componentInstance.innerHTML = instanceHTML;

            // Process <if> blocks
            forAll(componentInstance, "if", block =>
                // show child nodes if any of the attributes in the block are present
                block.replaceWith(...(block.getAttributeNames().some(attribute => componentInstance.hasAttribute(attribute)) ? block.childNodes : []))
            );

            // Process <script> blocks
            forAll(componentInstance, "script", script => script.outerHTML = eval(script.innerHTML) || "");

            // Replace the instance with its processed HTML
            componentInstance.outerHTML = componentInstance.innerHTML;
        });
        // Remove the template from the final markup
        template.remove();
    });
    // Process and remove inline component templates
    processTemplates(htmlDocument);
    // Process and remove component template imports
    forAll(htmlDocument, "iframe.template-import", templateImport => {
        templateImport.onload = _ => {
            processTemplates(templateImport.contentDocument);
            templateImport.remove();
        }
    });
})();