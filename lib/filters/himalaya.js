/* jshint node: true */
'use strict';

var Filter = require('broccoli-filter');
var himalaya = require('himalaya');
var toHTML = require('himalaya/translate').toHTML;

var levels = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };

function HimalayaFilter(inputTree, options) {
  if (!(this instanceof HimalayaFilter)) {
    return new HimalayaFilter(inputTree, options);
  }

  Filter.call(this, inputTree, options);

  this.inputTree = inputTree;
}

HimalayaFilter.prototype = Object.create(Filter.prototype);
HimalayaFilter.prototype.constructor = HimalayaFilter;
HimalayaFilter.prototype.extensions = ['html'];
HimalayaFilter.prototype.targetExtension = 'hbs';

HimalayaFilter.prototype.processString = function (string) {
  var oldNodes = himalaya.parse(string);

  var nodes = [{
    level: 0,
    parent: null,
    tagName: 'div',
    type: 'Element',
    children: []
  }];
  var root = nodes[0];
  var parent = root;
  var cursor = -1;

  oldNodes.forEach(originalNode => {
    var level = levels[originalNode.tagName];
    if (level) {
        while (parent.parent && parent.level >= level) {
            parent = parent.parent;
        }
        var node = {
            level: level,
            parent: parent,
            tagName: 'section',
            attributes: {
                className: ['container-' + originalNode.tagName]
            },
            type: 'Element',
            children: []
        };

        if (!parent.parent) {
          var article = {
            level: level,
            parent: parent,
            tagName: 'article',
            children: [node],
            attributes: {
              className: ['article-']
            }
          };
          parent.children.push(article);
          cursor = parent.children.length - 1;
        } else {
          parent.children.push(node);
        }

        node.children.push(originalNode);
        parent = {
            level: level,
            parent: node,
            tagName: 'div',
            attributes: {
                className: ['content-' + originalNode.tagName]
            },
            type: 'Element',
            children: []
        };
        node.children.push(parent);
        root.children[cursor].attributes.className[0] += originalNode.tagName;
    } else if (originalNode.type === 'Element') {
      if (cursor > -1) {
          var className = root.children[cursor].attributes.className[0];
          if (className.slice(-1) !== 'x') {
              root.children[cursor].attributes.className[0] += 'x';
          }
      }
      parent.children.push(originalNode);
    }
  });

  return toHTML(nodes);
};

module.exports = HimalayaFilter;
