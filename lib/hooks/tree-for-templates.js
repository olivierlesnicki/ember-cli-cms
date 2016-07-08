/* jshint node: true */
'use strict';

var fs = require('fs');
var Funnel = require('broccoli-funnel');

var MarkdownFilter = require('../filters/markdown');
var HimalayaFilter = require('../filters/himalaya');
var ExtensionFilter = require('../filters/extension');

var merge = require('../utilities/merge');

/**
 * Generate templates for content pages
 * @param  {Tree} tree
 * @return {Tree}
 */
module.exports = function treeForTemplates(tree) {

  var builtInContentPagesTree;
  var lazyLoadedContentPagesTree;

  if (fs.existsSync(this.addonConfig.directory)) {

    // Generate templates for built-in content pages
    builtInContentPagesTree = new HimalayaFilter(
      new MarkdownFilter(
        new Funnel(this.addonConfig.directory, {
          include: ['**/*.md', '**/*.markdown'],
          exclude: this.addonConfig.lazyLoad || []
        })
      )
    );

    // Generate templates for lazy loaded content pages
    if (this.addonConfig.lazyLoad) {
      lazyLoadedContentPagesTree = new ExtensionFilter(
        new Funnel(
          new Funnel(this.addonConfig.directory, {
            include: ['**/*.md', '**/*.markdown']
          }), {
            include: this.addonConfig.lazyLoad || []
        })
      );
    }

  }

  return merge(tree, builtInContentPagesTree, lazyLoadedContentPagesTree);
};
