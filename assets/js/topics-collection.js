var _topics = [];
// How many font-sizes do we want in the cloud?
const STEP_AMOUNT = 6;
// How big should the words be?
const FONT_SIZE_MULTIPLIER = 5;
// Minimum font-size for word with least volume
const MIN_FONT_SIZE = 11;

class TopicsCollection {
  // Fetch topics from api, execute callback when done
  static fetch(callback) {
    $.get('/api/topics')
      .done(data => {
        _topics = data.map(item => new Topic(item));
        this.computeWordSizes();

        callback(_topics);
      })
      .fail(e => {
        callback({ error: e });
      });
  }

  // Compute font-size of all fetched topics
  static computeWordSizes() {
    var min, max, range, stepSize, volumes;

    // Compute minimum and maximum volume to find size of one font-size step
    volumes = _topics.map(topic => topic.volume);
    min = Math.min.apply(null, volumes);
    max = Math.max.apply(null, volumes);
    range =  max - min;
    stepSize = range / STEP_AMOUNT;

    _topics.forEach(topic => {
      // Compute size from volume, normalize so words don't get too small
      var computedSize = Math.ceil((topic.volume - min) / stepSize);
      topic.wordSize = MIN_FONT_SIZE + computedSize * FONT_SIZE_MULTIPLIER;
    });
  }

  // Set topic active and others inactive
  static setTopicActive(topic) {
    _topics.forEach(t => t.active = t.id === topic.id);
  }

  // Retrieve currently active topic
  static getActiveTopic() {
    return _topics.find(t => t.active);
  }

  // Returns whole fetched collection
  static all() {
    return _topics;
  }
}

module.exports = TopicsCollection;
