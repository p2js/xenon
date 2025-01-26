(() => {
    let processComponentTemplate = template => {
        let componentName = template.getAttribute("_");
        template.removeAttribute("_");
        document.querySelectorAll(componentName).forEach(instance => {
            // Process the template HTML
            let instanceHTML = template.innerHTML;
            // Get all the attirbutes in the declaration
            for (let attributeName of template.getAttributeNames()) {
                // replace all instances of {<attributeName>} with the value given in the instance,
                // otherwise use the component's default value
                let attributeValue = instance.getAttribute(attributeName) || template.getAttribute(attributeName);
                instanceHTML = instanceHTML.replaceAll("{" + attributeName + "}", attributeValue);
            }
            // Replace all instances of {$children} with the instance's HTML
            instanceHTML = instanceHTML.replaceAll("{$children}", instance.innerHTML);
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
    document.querySelectorAll("template[_]").forEach(processComponentTemplate);
    // Process component template imports
    document.querySelectorAll("iframe.template-import").forEach(templateImport => {
        templateImport.onload = () => templateImport.contentDocument.querySelectorAll("template[_]").forEach(processComponentTemplate);
    });
})();