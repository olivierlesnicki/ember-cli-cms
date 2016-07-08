/* jshint node: true */
'use strict';

var Filter = require('broccoli-filter');
var markdown = require('markdown').markdown;

function MarkdownFilter(inputTree, options) {
  if (!(this instanceof MarkdownFilter)) {
    return new MarkdownFilter(inputTree, options);
  }

  Filter.call(this, inputTree, options);

  this.inputTree = inputTree;
}

MarkdownFilter.prototype = Object.create(Filter.prototype);
MarkdownFilter.prototype.constructor = MarkdownFilter;
MarkdownFilter.prototype.extensions = ['md', 'markdown'];
MarkdownFilter.prototype.targetExtension = 'html';

MarkdownFilter.prototype.processString = function (string) {
  return markdown.toHTML(string);
};

module.exports = MarkdownFilter;
