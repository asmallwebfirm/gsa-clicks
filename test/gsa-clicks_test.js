(function($) {

  module('jQuery#gsaClicks', {
    // This will run before each test in this module.
    setup: function() {
      this.fixture = $('#qunit-fixture a');
    }
  });

  test('fire load click only once', function() {
    var loadCalled = 0,
        originalClick = $.fn.gsaClicks.click;

    // Mock the click method.
    $.fn.gsaClicks.click = function(clickType) {
      if (clickType === 'load') {
        ++loadCalled;
      }
    };

    // Call gsaClicks several times.
    this.fixture.gsaClicks().gsaClicks().gsaClicks();
    strictEqual(loadCalled, 1, 'should only call load once');

    // Reset the mocked method for subsequent tests.
    $.fn.gsaClicks.click = originalClick;

    expect(1);
  });

  test('clicktype data written as expected', function() {
    var testClickTypes = {
          keymatch: '.keymatch',
          onebox: '.onebox',
          sitesearch: '.sitesearch',
          empty: ''
        },
        originalWrite = $.fn.gsaClicks.write,
        writeCallCount = 0,
        expectedCallCount = Object.keys(testClickTypes).length - 1;

    // Mock the write method.
    $.fn.gsaClicks.write = function(attribute, data) {
      if (attribute === 'gsa-clicktype') {
        ++writeCallCount;
        ok(this.is('.' + data), 'attempting to write correct data');
      }
    };

    // Call gsaClicks with our options.
    this.fixture.gsaClicks({clickTypes: testClickTypes});

    // Ensure clicktype data is written the correct number of times.
    strictEqual(writeCallCount, expectedCallCount, 'should write clicktype data ' + expectedCallCount + ' times');

    // Reset the mocked method for subsequent tests.
    $.fn.gsaClicks.write = originalWrite;

    // One assertion per expected call + the expected count assertion later.
    expect(expectedCallCount + 1);
  });

  test('data read as expected on click', function() {
    var readCallCount = {
          'gsa-clicktype' : 0,
          'gsa-rank' : 0,
          'gsa-clickdata' : 0
        },
        originalRead = $.fn.gsaClicks.read,
        readAttribute;

    // Mock the read method.
    $.fn.gsaClicks.read = function(attribute) {
      ++readCallCount[attribute];
    };

    // Invoke gsaClicks.
    this.fixture.gsaClicks({});

    // Trigger a mousedown event on a link.
    $('a.onebox').trigger('mousedown');

    // Ensure all attribute reads were called correctly.
    for (readAttribute in readCallCount) {
      strictEqual(readCallCount[readAttribute], 1, 'read attribute ' + readAttribute + ' once');
    }

    // Trigger another mousedown event on a link.
    $('a.keymatch').trigger('mousedown');

    // Ensure all attribute reads were called correctly.
    for (readAttribute in readCallCount) {
      strictEqual(readCallCount[readAttribute], 2, 'read attribute ' + readAttribute + ' again');
    }

    // Reset the mocked method for subsequent tests.
    $.fn.gsaClicks.read = originalRead;

    // We expect twice as many assertions as there are call counts.
    expect(Object.keys(readCallCount).length * 2);
  });

  test('click method called as expected with undefined data', function() {
    var testSelector = 'a.onebox',
        $testElement = $(testSelector),
        originalClick = $.fn.gsaClicks.click,
        clickCallData = {};

    // Mock the click method.
    $.fn.gsaClicks.click = function(clickType, targetUrl, rank, clickData) {
      clickCallData = {
        'elem' : $(this),
        'clickType' : clickType,
        'targetUrl' : targetUrl,
        'rank' : rank,
        'clickData' : clickData
      };
    };

    // Invoke gsaClicks.
    this.fixture.gsaClicks({});

    // Trigger a mousedown event on a link.
    $testElement.trigger('mousedown');

    ok(clickCallData.elem.is(testSelector), 'click triggered on expected element');
    strictEqual('OTHER', clickCallData.clickType, 'undefined clicktype called with "OTHER"');
    strictEqual($testElement.attr('href'), clickCallData.targetUrl, 'targetUrl matches triggered element');
    strictEqual(null, clickCallData.rank, 'undefined rank called with null');
    strictEqual(null, clickCallData.clickData, 'undefined clickData called with null');

    // Reset the mocked click method for subsequent tests.
    $.fn.gsaClicks.click = originalClick;

    expect(5);
  });

  test('click method called as expected with read data', function() {
    var testSelector = 'a.onebox',
      $testElement = $(testSelector),
      originalClick = $.fn.gsaClicks.click,
      originalRead = $.fn.gsaClicks.read,
      readData = {
        'gsa-clicktype' : 'onebox',
        'gsa-rank' : 123,
        'gsa-clickdata' : 'zzz'
      },
      clickCallData = {};

    // Mock the click method.
    $.fn.gsaClicks.click = function(clickType, targetUrl, rank, clickData) {
      clickCallData = {
        'elem' : $(this),
        'clickType' : clickType,
        'targetUrl' : targetUrl,
        'rank' : rank,
        'clickData' : clickData
      };
    };

    // Mock the read method.
    $.fn.gsaClicks.read = function(attribute) {
      return readData[attribute];
    };

    // Invoke gsaClicks.
    this.fixture.gsaClicks({});

    // Trigger a mousedown event on a link.
    $testElement.trigger('mousedown');

    ok(clickCallData.elem.is(testSelector), 'click triggered on expected element');
    strictEqual(readData['gsa-clicktype'], clickCallData.clickType, 'click triggered with expected clicktype');
    strictEqual($testElement.attr('href'), clickCallData.targetUrl, 'targetUrl matches triggered element');
    strictEqual(readData['gsa-rank'], clickCallData.rank, 'click triggered with expected rank');
    strictEqual(readData['gsa-clickdata'], clickCallData.clickData, 'click triggered with expected clickData');

    // Reset mocked methods for subsequent tests.
    $.fn.gsaClicks.click = originalClick;
    $.fn.gsaClicks.read = originalRead;

    expect(5);
  });

  test('is chainable', function() {
    strictEqual(this.fixture.gsaClicks(), this.fixture, 'should be chainable');
    expect(1);
  });

  module('jQuery#gsaClicks methods', {
    // This will run before each test in this module.
    setup: function() {
      this.fixture = $('#qunit-fixture a');
    }
  });

}(jQuery));
