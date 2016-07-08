import Ember from 'ember';
import DS from 'ember-data';
import layout from '../templates/components/ember-cli-static-loader';

export default Ember.Component.extend({
  layout,
  path: null,
  classNames: ['ember-cli-static-loader'],
  content: Ember.computed('path', function () {
    console.log(this.get('path'));
    return DS.PromiseObject.create({
      promise: Ember.$.get('/pages/' + this.get('path')).then(html => {
        return Ember.Object.create({ html });
      })
    });
  })
});
