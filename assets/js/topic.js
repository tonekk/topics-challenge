// Represents the Topic model
class Topic {
  constructor(data) {
    for(var key in data) {
      this[key] = data[key];
    }
  }
};

module.exports = Topic;
