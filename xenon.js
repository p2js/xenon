(_ => {
    // Redefinition to minify every other call to a single letter
    let selectAll = (element, selector) => element.querySelectorAll(selector);

    // Process a document's component templates and apply them to the current document
    let processTemplates = doc => selectAll(doc, "template[_]").forEach(template => {
        // Select all elements in the current document with the name specified in the attribute
        selectAll(document, template.getAttribute("_")).forEach(instance => {
            // Process the template HTML
            let instanceHTML = template.innerHTML;

            // Get the attributes in the declaration
            for (let attributeName of template.getAttributeNames().filter(name => name != "_")) {
                // replace all appearances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}",
                    instance.getAttribute(attributeName) || template.getAttribute(attributeName));
            }

            // Replace all appearances of {$children} with the instance's HTML
            instanceHTML = instanceHTML.replaceAll("{$children}", instance.innerHTML);

            // Place the processed HTML inside the instance 
            instance.innerHTML = instanceHTML;

            // Process <if> blocks
            selectAll(instance, "if").forEach(block => {
                // show child nodes if any of the attributes in the block are present
                if (block.getAttributeNames().some(attribute => instance.hasAttribute(attribute))) {
                    block.replaceWith(...block.childNodes);
                } else {
                    block.remove();
                };
            });

            // Replace the instance with its processed HTML
            instance.outerHTML = instance.innerHTML;
        });
        // Remove the template from the final markup
        template.remove();
    });
    // Process and remove inline component templates
    processTemplates(document);
    // Process and remove component template imports
    selectAll(document, "iframe.template-import").forEach(templateImport => {
        templateImport.onload = _ => {
            processTemplates(templateImport.contentDocument);
            templateImport.remove();
        }
    });
})();