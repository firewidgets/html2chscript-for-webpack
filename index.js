
const LOADER_UTILS = require('loader-utils');
var CVDOM = require('../cvdom'); CVDOM = CVDOM.forLib(CVDOM.makeLib());


module.exports = function(source) {
    var self = this;

    self.cacheable && self.cacheable();

    var sourceFilename = LOADER_UTILS.getRemainingRequest(self);
    var current = LOADER_UTILS.getCurrentRequest(self);

    return CVDOM.html2hscript(source, {
        "controlAttributes": {
            "prefix": "component:",
            "remove": true,
            "scriptLocations": {
                "window": true
            }
        }
    }, function(err, chscript, components, inlineScripts, cjsCode) {
        if (err) return self.callback(err);

        self.callback(null, cjsCode, {});
    });
};
