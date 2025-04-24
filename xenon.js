(_ => {
    // Redefinitions to minify every other reference to a single letter
    let forAll = (element, selector, fn) => element?.querySelectorAll(selector).forEach(fn);
    let htmlDocument = document;
    let getAttribute = "getAttribute";
    let getAttributeNames = "getAttributeNames";
    let replaceAll = "replaceAll";
    let innerHTML = "innerHTML";
    // Process a document's component templates and apply them to the current document
    let processTemplates = doc => forAll(doc, "template[_]", template => {
        // Select all elements in the current document with the name specified in the attribute
        forAll(htmlDocument, template[getAttribute]("_"), instance => {
            // Process the template HTML
            let instanceHTML = template[innerHTML];

            // Get the attributes in the declaration (besides "_")
            template[getAttributeNames]().forEach(attributeName => attributeName != "_" && (
                // replace all appearances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                instanceHTML = instanceHTML[replaceAll](`{${attributeName}}`,
                    instance[getAttribute](attributeName) || template[getAttribute](attributeName))));
            // Replace all appearances of {$children} with the instance's HTML
            instanceHTML = instanceHTML[replaceAll]("{$children}", instance[innerHTML]);

            // Place the processed HTML inside the instance 
            instance[innerHTML] = instanceHTML;

            // Process <if> blocks
            forAll(instance, "if", block =>
                // show child nodes if any of the attributes in the block are present
                block.replaceWith(...(
                    block[getAttributeNames]().some(attribute => instance.hasAttribute(attribute))
                        ? block.childNodes
                        : []
                ))
            );

            // Replace the instance with its processed HTML
            instance.outerHTML = instance[innerHTML];
        });
        // Remove the template from the final markup
        template.remove();
    });
    // Process and remove inline component templates
    processTemplates(htmlDocument);
    // Process and remove component template imports
    forAll(htmlDocument, ".template-import", templateImport =>
        templateImport.onload = _ => {
            processTemplates(templateImport.contentDocument);
            templateImport.remove();
        }
    );
})();