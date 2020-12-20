import AbstractSerializer from './AbstractSerializer.js';
import jsYaml from 'js-yaml';

export default class YamlSerializer extends AbstractSerializer {
    /** @override */
    static serialize(data) {
        return jsYaml.dump(data, { indent: 4 });
    }

    static matches(format) {
        return ['yaml', 'yml'].includes(format.toLowerCase());
    }

    static mimeType() {
        return 'application/x-yaml';
    }
}
