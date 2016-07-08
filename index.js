/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var writeFile = require('broccoli-file-creator');
var EmberRouterGenerator = require('ember-router-generator');
var path = require('path');
var glob = require('glob');
var MarkdownFilter = require('./lib/filters/markdown');
var HimalayaFilter = require('./lib/filters/himalaya');

var treeForTemplatesHook = require('./lib/hooks/tree-for-templates');
var treeForPublicHook = require('./lib/hooks/tree-for-public');

module.exports = {
  name: 'ember-cli-cms',

  included: function included(app) {
    this._super.included.apply(this, arguments);

    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    this.addonConfig = this.app.project.config(app.env)['ember-cli-cms'] || {};
    this.addonConfig.directory = this.addonConfig.directory || 'cms';

    if (app.project.pkg['ember-addon'] && !app.project.pkg['ember-addon'].paths) {
      this.addonConfig.directory = path.resolve(app.project.root, path.join('tests', 'dummy', this.addonConfig.directory));
    } else {
      this.addonConfig.directory = path.resolve(app.project.root, this.addonConfig.directory);
    }
  },

  treeForTemplates: treeForTemplatesHook,
  treeForPublic: treeForPublicHook,

  treeForApp: function(tree) {
    var cwd = this.addonConfig.directory;
    var files = glob.sync('**/*.md', {cwd: cwd});
    var generator = new EmberRouterGenerator('Router.map(function() {\n})');

    files.forEach(function(file) {
      if (file !== 'index.md') {
        generator = generator.add(file.replace('.md', ''));
        generator = new EmberRouterGenerator(generator.code());
      }
    });

    var code = [
      "import Router from '../router'",
      'export function initialize(/* application */) {',
      generator.code(),
      '}',
      '',
      'export default {',
      "  name: 'ember-cli-cms',",
      "initialize",
      '};'
    ].join('\n');

    if (tree) {
      tree = new MergeTrees([
        tree,
        this.treeForRouter(code)
      ]);
    } else {
      tree = this.treeForRouter(code);
    }

    return tree;
  },

  treeForRouter: function(code) {
    return writeFile('/initializers/ember-cli-cms.js', code);
  },

  /**
   * Pick all .md files from the cms pages directory
   * and convert them into .hbs templates.
   * @param  {Object} options
   * @return {Tree}
   */
  treeForContentTemplates: function(options) {
    options = options || {};

    options.include = ['**/*.md', '**/*.markdown'];

    var funnel = new Funnel(this.addonConfig.directory, options);
    var tree = new HimalayaFilter(new MarkdownFilter(funnel));

    return tree;
  },

  isDevelopingAddon: function() {
    return true;
  }
};
