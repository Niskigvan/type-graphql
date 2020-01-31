"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
function Extensions(extensions) {
    return (targetOrPrototype, propertyKey, descriptor) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        if (propertyKey) {
            getMetadataStorage_1.getMetadataStorage().collectExtensionsFieldMetadata({
                target: targetOrPrototype.constructor,
                fieldName: propertyKey,
                extensions,
            });
        }
        else {
            getMetadataStorage_1.getMetadataStorage().collectExtensionsClassMetadata({
                target: targetOrPrototype,
                extensions,
            });
        }
    };
}
exports.Extensions = Extensions;
