<topic-info class={ empty: !TopicsCollection.getActiveTopic() }>
  <p class='label'>Information on topic "{ activeTopic().label }"</p>

  <p class='total-mentions'>Total mentions: { activeTopic().volume }</p>

  <p>
    <div class="positive-mentions">
      Positive mentions: <span class="positive">{ activeTopic().sentiment.positive || 0 }</span>
    </div>
    <div class="neutral-mentions">
      Neutral mentions: <span class="neutral">{ activeTopic().sentiment.neutral || 0 }</span>
    </div>
    <div class="negative-mentions">
      Negative mentions: <span class="negative">{ activeTopic().sentiment.negative || 0 }</span>
    </div>
  </p>

  activeTopic() {
    return TopicsCollection.getActiveTopic() || {};
  }
</topic-info>
