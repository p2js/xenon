(_ => {
    // Redefinition to minify every other call to a single letter
    let forAll = (element, selector, fn) => element?.querySelectorAll(selector).forEach(fn);
    // Process a document's component templates and apply them to the current document
    let processTemplates = doc => forAll(doc, "template[_]", template => {
        // Select all elements in the current document with the name specified in the attribute
        forAll(document, template.getAttribute("_"), instance => {
            // Process the template HTML
            let instanceHTML = template.innerHTML;
            // For each attribute in the declaration, replace each appearance of {<attributeName>}
            // With the value givgen in the instance, otherwise use the declaration's default value
            template.getAttributeNames().forEach(attributeName =>
                attributeName != "_" && (instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}",
                    instance.getAttribute(attributeName) || template.getAttribute(attributeName))));

            // Replace all appearances of {$<property>} with the instance's property
            // (If it is an element - ie. has an outer HTML, return that instead of the string)
            instanceHTML = instanceHTML.replaceAll(/{\$(\S+?)}/g, (_, property) =>
                instance[property].outerHTML || instance[property]
            );

            // Place the processed HTML inside the instance 
            instance.innerHTML = instanceHTML;
            // Process <if> blocks
            forAll(instance, "if", ifBlock =>
                // show child nodes if any of the attributes in the block are 
                ifBlock.replaceWith(...(
                    ifBlock.getAttributeNames().some(attribute => instance.hasAttribute(attribute))
                        ? ifBlock.childNodes
                        : []
                ))
            );
            // Replace the instance with its processed HTML
            instance.outerHTML = instance.innerHTML;
        });
        // Remove the template from the final markup
        template.remove();
    });
    // Process and remove inline component templates
    processTemplates(document);
    // Process and remove component template imports
    forAll(document, ".template-import", templateImport => {
        templateImport.onload = _ => {
            processTemplates(templateImport.contentDocument);
            templateImport.remove();
        }
    });
})();