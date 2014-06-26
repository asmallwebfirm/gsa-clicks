/*
 * gsa-clicks
 * https://github.com/asmallwebfirm/gsa-clicks
 *
 * Copyright (c) 2014 Eric Peterson
 * Licensed under the GPL-2.0 license.
 */

(function($) {

  var options = {},
      gsaLoadFired = false;

  // Collection method.
  $.fn.gsaClicks = function(optionOverrides) {
    // Override default options with passed-in options.
    options = $.extend(true, options, $.fn.gsaClicks.options, optionOverrides);

    $.each(options.clickTypes, function (clickType, selector) {
      if (selector) {
        // Mark the click type for each selected element.
        $.fn.gsaClicks.write.call($(selector), 'gsa-clicktype', clickType);
      }
    });

    // Fire off a "load" event to the GSA.
    if (!gsaLoadFired) {
      $.fn.gsaClicks.click.call(this, 'load');
      gsaLoadFired = true;
    }

    return this.mousedown(function() {
      var $link = $(this),
          clickType = $.fn.gsaClicks.read.call($link, 'gsa-clicktype'),
          rank = $.fn.gsaClicks.read.call($link, 'gsa-rank'),
          clickData = $.fn.gsaClicks.read.call($link, 'gsa-clickdata');

      $.fn.gsaClicks.click.call($link,
        typeof clickType === 'undefined' ? "OTHER" : clickType,
        $link.attr('href'),
        typeof rank  === 'undefined' ? null : rank,
        typeof clickData === 'undefined' ? null : clickData
      );
    });
  };

  // Default options.
  $.fn.gsaClicks.options = {
    // Host against which click calls should be made (exclude /click path part).
    host: '',
    // Collection for which search results are being presented.
    collection: 'default_collection',
    // Query string that resulted in the results presented.
    query: '',
    // The page start of the results presented.
    start: 0,
    // An object whose keys are click types and whose values are selectors used
    // to attach click type data
    clickTypes: {
      'advanced' : '',
      'advanced_swr' : '',
      'c' : '',
      'cache' : '',
      'cluster' : '',
      'db' : '',
      'desk.groups' : '',
      'desk.images' : '',
      'desk.local' : '',
      'desk.news' : '',
      'desk.web': '',
      'help' : '',
      'keymatch' : '',
      'load' : '',
      'logo' : '',
      'nav.next' : '',
      'nav.page' : '',
      'nav.prev' : '',
      'onebox' : '',
      'sitesearch' : '',
      'sort' : '',
      'spell' : '',
      'synonym' : '',
      'OTHER' : ''
    }
  };

  /**
   * Report click data to the /click service on the GSA.
   *
   * @param clickType
   *   Click type.
   * @param targetUrl
   *   (optional) Target URL the user clicked on.
   * @param rank
   *   (optional) Rank.
   * @param clickData
   *   (optional) Click data.
   *
   * @see http://www.google.com/support/enterprise/static/gsa/docs/admin/70/gsa_doc_set/xml_reference/advanced_search_reporting.html#1080237
   */
  $.fn.gsaClicks.click = function(clickType, targetUrl, rank, clickData) {
    var img,
        src;

    // Construct the image src parameter.
    src = options.host + '/click' +
      "?site=" + encodeURIComponent(options.collection) +
      "&q=" + encodeURIComponent(options.query) +
      "&s=" + encodeURIComponent(options.start) +
      "&ct=" + encodeURIComponent(clickType);

    // Only apply optional arguments if provided with valid values.
    if (typeof targetUrl !== 'undefined' && targetUrl !== null) {
      src = src.concat('&url=', encodeURIComponent(targetUrl.replace(/#.*/, "")));
    }

    if (typeof rank !== 'undefined' && rank !== null) {
      src = src.concat('&r=', encodeURIComponent(rank));
    }

    if (typeof clickData !== 'undefined' && clickData !== null) {
      src = src.concat('&cd=', encodeURIComponent(clickData));
    }

    // Create an image element with an src value as described above.
    img = document.createElement('img');
    img.src = src;

    return true;
  };

  /**
   * Writes specified data to a given attribute on the given element.
   */
  $.fn.gsaClicks.write = function(attribute, data) {
    $(this).data(attribute, data);
  };

  /**
   * Reads a specified attribute from the given element.
   */
  $.fn.gsaClicks.read = function(attribute) {
    return $(this).data(attribute);
  };

}(jQuery));
