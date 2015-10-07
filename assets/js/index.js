// Libraries
global.riot = require('riot');
global.$ = require('jquery');

// Tags
require('./tags/main');
require('./tags/word-cloud');
require('./tags/word');
require('./tags/topic-info');

// Models
global.Topic = require('./topic');

// Collections
global.TopicsCollection = require('./topics-collection');

$(() => {
  TopicsCollection.fetch(function(topics) {
    riot.mount('main');
    riot.mount('word');
    riot.mount('word-cloud', {
      words: topics
    });
  });
});
