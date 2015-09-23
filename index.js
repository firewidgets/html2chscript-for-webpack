
const LOADER_UTILS = require('loader-utils');
var CVDOM = require('../cvdom'); CVDOM = CVDOM.forLib(CVDOM.makeLib());


module.exports = function(source) {
    var self = this;

    self.cacheable && self.cacheable();

    var sourceFilename = LOADER_UTILS.getRemainingRequest(self);
    var current = LOADER_UTILS.getCurrentRequest(self);

/*
  var query = loaderUtils.parseQuery(this.query);
  if (query.insertPragma) {
    source = '/ ** @jsx ' + query.insertPragma + ' * /' + source;
  }
*/

//console.log("TREANSFORM", sourceFilename, source);

    return CVDOM.html2hscript(source, {
        "controlAttributes": {
            "prefix": "component:",
            "remove": true,
            "scriptLocations": {
                "window": true
            }
        }
    }, function(err, chscript, components, inlineScripts) {
        if (err) return self.callback(err);

        var code = [];
        code.push('module.exports = {');
        code.push(  'getLayout: function () {');
        code.push(    'return {');
        code.push(      'buildVTree: function (h, ch) {');
        code.push(        'return ' + chscript + ';');
        code.push(      '}');
        code.push(    '};');
        code.push(  '},');
        code.push(  'getComponents: function () {');
        code.push(    'return {');
        Object.keys(components).forEach(function (id, i) {
            code.push(      (i>0?",":"") + '"' + id + '": {');
            code.push(        'buildVTree: function (h, ch) {');
            code.push(          'return ' + components[id].chscript + ';');
            code.push(        '}');
            code.push(      '}');
        });
        code.push(  '  };');
        code.push(  '},');
        code.push(  'getScripts: function () {');
        code.push(    'return ' + JSON.stringify(inlineScripts) + ';');
        code.push(  '}');
        code.push('};');

        self.callback(null, code.join("\n"), {});
    });
    

/*
  var transform = jstransform.transform(source, {
    react: true,
    harmony: query.harmony,
    stripTypes: query.stripTypes,
    es5: query.es5,
    sourceMap: this.sourceMap
  });
  if (transform.sourceMap) {
    transform.sourceMap.sources = [sourceFilename];
    transform.sourceMap.file = current;
    transform.sourceMap.sourcesContent = [source];
  }
  this.callback(null, transform.code, transform.sourceMap);
*/
};
