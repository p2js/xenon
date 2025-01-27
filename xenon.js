(_ => {
    // Process a document's component templates and apply them to the current document
    let processTemplates = doc => doc.querySelectorAll("template[_]").forEach(template => {
        // Select all elements in the current document with the name specified in the attribute
        document.querySelectorAll(template.getAttribute("_")).forEach(instance => {
            // Process the template HTML
            let instanceHTML = template.innerHTML;
            // Get the attributes in the declaration
            for (let attributeName of template.getAttributeNames().filter(name => name != "_")) {
                // replace all appearances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                let attributeValue = instance.getAttribute(attributeName) || template.getAttribute(attributeName);
                instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}", attributeValue);
            }
            // Replace all appearances of {$children} with the instance's HTML
            instanceHTML = instanceHTML.replaceAll("{$children}", instance.innerHTML);
            // Place the processed HTML inside the instance 
            instance.innerHTML = instanceHTML;
            // Process <if> blocks
            instance.querySelectorAll("if").forEach(block => {
                // show child nodes if any of the attributes in the block are present
                if (block.getAttributeNames().some(attribute => instance.hasAttribute(attribute))) {
                    block.replaceWith(...block.childNodes);
                } else {
                    block.remove();
                };
            });
            instance.outerHTML = instance.innerHTML;
        });
        // Remove the template from the final markup
        template.remove();
    });
    // Process and remove inline component templates
    processTemplates(document);
    // Process and remove component template imports
    document.querySelectorAll("iframe.template-import").forEach(templateImport => {
        templateImport.onload = _ => {
            processTemplates(templateImport.contentDocument);
            templateImport.remove();
        }
    });
})();