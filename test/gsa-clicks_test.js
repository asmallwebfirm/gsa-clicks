(function($) {

  module('jQuery#gsaClicks', {
    // This will run before each test in this module.
    setup: function() {
      this.fixture = $('#qunit-fixture');
    }
  });

  test('fire load only once', function() {
    var loadCalled = 0,
        originalClick = $.fn.gsaClicks.click;

    // Stub the click method.
    $.fn.gsaClicks.click = function(clickType) {
      if (clickType === 'load') {
        ++loadCalled;
      }
    };

    // Call gsaClicks several times.
    this.fixture.gsaClicks().gsaClicks().gsaClicks();
    strictEqual(loadCalled, 1, 'should only call load once');

    // Reset the stubbed method for subsequent tests.
    $.fn.gsaClicks.click = originalClick;

    expect(1);
  });

  test('is chainable', function() {
    strictEqual(this.fixture.gsaClicks(), this.fixture, 'should be chainable');
    expect(1);
  });

}(jQuery));
