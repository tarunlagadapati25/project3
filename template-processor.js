'use strict';
class TemplateProcessor {
    static process(template, data) {
        return template.replace(/{{\s*([\w.]+)\s*}}/g, (match, property) => {
            // Use a callback function to replace placeholders with data properties
            let value = data;
            const props = property.split('.');
            for (const prop of props) {
                if (value.hasOwnProperty(prop)) {
                    value = value[prop];
                } else {
                    // Property not found, return an empty string
                    return '';
                }
            }
            return value;
        });
    }
}
