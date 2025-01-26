(() => {
    function processComponentDeclaration(componentDeclaration) {
        let componentName = componentDeclaration.getAttribute("_");
        componentDeclaration.removeAttribute("_");
        document.querySelectorAll(componentName).forEach(instance => {
            // Process the template HTML
            let instanceHTML = componentDeclaration.innerHTML;
            // Get all the attirbutes in the declaration
            for (let attributeName of componentDeclaration.getAttributeNames()) {
                // replace all instances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                let attributeValue = instance.getAttribute(attributeName) || componentDeclaration.getAttribute(attributeName);
                instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}", attributeValue);
            }
            // Place it inside the instance for if-block processing
            instance.innerHTML = instanceHTML;

            instance.querySelectorAll("if").forEach(block => {
                // show child nodes if any of the attributes in the block are present
                if (block.getAttributeNames().some(attribute => instance.hasAttribute(attribute))) {
                    block.replaceWith(...block.childNodes);
                } else {
                    block.remove();
                };
            });

            // Replace the instance with its processed template HTML
            instance.outerHTML = instance.innerHTML;
        });
    }
    // Process inline component templates
    document.querySelectorAll("template[_]").forEach(processComponentDeclaration);
    // Process component template imports
    document.querySelectorAll("iframe.template-import").forEach(templateImport => {
        templateImport.onload = () => templateImport.contentDocument.querySelectorAll("template[_]").forEach(processComponentDeclaration);
    });
})();