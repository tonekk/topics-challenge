var Browser = require('zombie');
Browser.localhost('example.com', 3001);
browser = new Browser();

describe('word-cloud scenarios', function(){
  before(function(done) {
    browser.visit('/', done);
  });

  it('Page must contain word-cloud', function(){
    browser.assert.success();
  });
  it('Page must contain word-cloud', function(){
    browser.assert.element('word-cloud');
  });
  it('word-cloud must contain 4 words', function(){
    browser.assert.elements('word-cloud > word', 4);
  });

  // Word sentiment
  it('word-cloud must contain 2 positive words', function(){
    browser.assert.elements('word > span.positive', 2);
  });
  it('word-cloud must contain 1 negative word', function() {
    browser.assert.elements('word > span.negative', 1);
  });
  it('word-cloud must contain 1 neutral word', function() {
    browser.assert.elements('word > span:not(.positive):not(.negative)', 1);
  });

  // Word size
  it('must assign different font-sizes to words, based on volume', function() {
    // We redefine these here for better understanding
    // see topics-collection.js
    const FONT_SIZE_MULTIPLIER = 5;
    const MIN_FONT_SIZE = 11;

    // Word with least volume, should have FONT_SIZE_MULTIPLIER * 1
    browser.assert.elements('#w_1', 'font-size', 0 * FONT_SIZE_MULTIPLIER + MIN_FONT_SIZE + 'px');

    // Word with least sentiment score, should have FONT_SIZE_MULTIPLIER * 6
    // (6 steps)
    browser.assert.elements('#w_3', 'font-size', 6 * FONT_SIZE_MULTIPLIER + MIN_FONT_SIZE + 'px');
  });

  it('must display topic-info on word clicked', function() {
    browser.assert.element('topic-info.empty');

    function assertDetailInfo(label, volume, postiveMentions, neutralMentions, negativeMentions) {
      browser.assert.text('topic-info > .label', 'Information on topic "' + label + '"');
      browser.assert.text('topic-info > .total-mentions', 'Total mentions: ' + volume);
      browser.assert.text('topic-info .positive-mentions', 'Positive mentions: ' + postiveMentions);
      browser.assert.text('topic-info .neutral-mentions', 'Neutral mentions: ' + neutralMentions);
      browser.assert.text('topic-info .negative-mentions', 'Negative mentions: ' + negativeMentions);
    }

    browser.click('#w_1');
    browser.assert.element('topic-info:not(.empty)');
    assertDetailInfo('Berghain', 165, 29, 133, 3);

    browser.click('#w_2');
    assertDetailInfo('Kater Blau', 48, 0, 18, 30);
  });
});

describe('api scenarios', function(){
  it('must be able to fetch collection', function(){
    browser.visit('/api/topics', function() {
      browser.assert.success();
    });
  });
  it('must return 404 for non-existent collection', function() {
    browser.visit('/api/books', function() {
      browser.assert.status(404);
    });
  });
  it('must be able to fetch a single resource', function(){
    browser.visit('/api/topics/1', function() {
      browser.assert.success();
    });
  });
  it('must return 404 for non-existent id', function() {
    browser.visit('/api/topics/1337', function() {
      browser.assert.status(404);
    });
  });
});
