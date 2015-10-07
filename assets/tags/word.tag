<word id={ identifier() } style={ fontSize() } onClick={ onClick }>
  <span class={ positive: sentimentScore > 60, negative: sentimentScore < 40 }>
    { label }
  </span>

  onClick() {
    // Set topic active and update topic-detail view
    TopicsCollection.setTopicActive(this._item);
    riot.update();
  }

  fontSize() {
    return 'font-size: ' + this.wordSize + 'px';
  }

  identifier() {
    return 'w_' + this.id;
  }
</word>
