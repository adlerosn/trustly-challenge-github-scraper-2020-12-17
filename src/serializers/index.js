import AbstractSerializer from './AbstractSerializer.js';
import JsonSerializer from './JsonSerializer.js';
import XmlSerializer from './XmlSerializer.js';
import YamlSerializer from './YamlSerializer.js';

const KNOWN_SERIALIZERS = [
    AbstractSerializer,
    JsonSerializer,
    XmlSerializer,
    YamlSerializer,
];

/**
 * Retrieves a serializer from string;
 *
 * @param {string} desiredFormat The desired serializer format
 * @param {string?} defaultFormat The default fallback format in order not to return undefined
 * @returns {AbstractSerializer?} The serializer
 */
function getSerializer(desiredFormat, defaultFormat) {
    const desiredSerializer = KNOWN_SERIALIZERS.find((cls) => cls.matches(desiredFormat));
    if (desiredSerializer === undefined && defaultFormat !== undefined) return getSerializer(defaultFormat);
    return desiredSerializer;
}

export {
    getSerializer, JsonSerializer, XmlSerializer, YamlSerializer,
};
