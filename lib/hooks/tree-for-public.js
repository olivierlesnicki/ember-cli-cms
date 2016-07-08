/* jshint node: true */
'use strict';

var fs = require('fs');
var Funnel = require('broccoli-funnel');

var MarkdownFilter = require('../filters/markdown');
var HimalayaFilter = require('../filters/himalaya');

var merge = require('../utilities/merge');

/**
 * Generate templates for lazy loaded content pages
 * @param  {Tree} tree
 * @return {Tree}
 */
module.exports = function treeForPublic(tree) {

  var lazyLoadedContentPagesTree;
  var contentTree;

  if (fs.existsSync(this.addonConfig.directory)) {

    // Generate templates for lazy loaded content pages
    if (this.addonConfig.lazyLoad) {
      lazyLoadedContentPagesTree = new HimalayaFilter(
        new MarkdownFilter(
          new Funnel(
            new Funnel(this.addonConfig.directory, {
              include: ['**/*.md', '**/*.markdown']
            }), {
              include: this.addonConfig.lazyLoad || [],
              destDir: '/pages'
          })
        ), {
        targetExtension: 'html'
      });
    }

    // Copy static content accross
    contentTree = new Funnel(this.addonConfig.directory, {
      exclude: ['**/*.md', '**/*.markdown']
    });

  }

  return merge(tree, lazyLoadedContentPagesTree, contentTree);
};
