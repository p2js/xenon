(_ => {
    // Redefinitions to minify every other call to a single letter
    let forAll = (element, selector, fn) => element.querySelectorAll(selector).forEach(fn);
    let getAttribute = (element, attributeName) => element.getAttribute(attributeName);
    let remove = element => element.remove();
    let htmlDocument = document;

    // Process a document's component templates and apply them to the current document
    let processTemplates = doc => forAll(doc, "template[_]", template => {
        // Select all elements in the current document with the name specified in the attribute
        forAll(htmlDocument, getAttribute(template, "_"), _instance => {
            // Process the template HTML
            let instanceHTML = template.innerHTML;
            // Redefine instance (as separate non-mangled variable to be used by eval)
            let instance = _instance;

            for (let attributeName of template.getAttributeNames().filter(name => name != "_")) {
                // replace all appearances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}",
                    getAttribute(_instance, attributeName) || getAttribute(template, attributeName));
            }

            // Replace all appearances of {$children} with the instance's HTML
            instanceHTML = instanceHTML.replaceAll("{$children}", _instance.innerHTML);

            // Place the processed HTML inside the instance 
            _instance.innerHTML = instanceHTML;

            // Process <if> blocks
            forAll(_instance, "if", block =>
                // show child nodes if any of the attributes in the block are present
                block.replaceWith(...(block.getAttributeNames().some(attribute => _instance.hasAttribute(attribute)) ? block.childNodes : []))
            );

            // Process <script> blocks
            forAll(_instance, "script", script => {
                eval(script.innerHTML);
                remove(script)
            });

            // Replace the instance with its processed HTML
            _instance.outerHTML = _instance.innerHTML;
        });
        // Remove the template from the final markup
        remove(template);
    });
    // Process and remove inline component templates
    processTemplates(htmlDocument);
    // Process and remove component template imports
    forAll(htmlDocument, "iframe.template-import", templateImport => {
        templateImport.onload = _ => {
            processTemplates(templateImport.contentDocument);
            remove(templateImport);
        }
    });
})();