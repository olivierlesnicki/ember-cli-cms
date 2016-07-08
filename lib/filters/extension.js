/* jshint node: true */
'use strict';

var Filter = require('broccoli-filter');

function ExtensionFilter(inputTree, options) {
  if (!(this instanceof ExtensionFilter)) {
    return new ExtensionFilter(inputTree, options);
  }

  Filter.call(this, inputTree, options);

  this.inputTree = inputTree;
}

ExtensionFilter.prototype = Object.create(Filter.prototype);
ExtensionFilter.prototype.constructor = ExtensionFilter;
ExtensionFilter.prototype.extensions = ['md', 'markdown'];
ExtensionFilter.prototype.targetExtension = 'hbs';

ExtensionFilter.prototype.processString = function (string, path) {
  path = path.replace('.md', '').replace('.markdown', '');
  return '{{ember-cli-cms-loader path="' + path + '.html"}}';
};

module.exports = ExtensionFilter;
