# GSA Click Tracking [![Build Status](https://travis-ci.org/asmallwebfirm/gsa-clicks.svg)](https://travis-ci.org/asmallwebfirm/gsa-clicks) [![Code Climate](https://codeclimate.com/github/asmallwebfirm/gsa-clicks.png)](https://codeclimate.com/github/asmallwebfirm/gsa-clicks) [![Code Coverage](https://codeclimate.com/github/asmallwebfirm/gsa-clicks/coverage.png)](https://codeclimate.com/github/asmallwebfirm/gsa-clicks)

A simple jQuery plugin to integrate Google Search Appliance Advanced Search Reporting with custom built search interfaces.

## Getting Started
Download the latest stable release and include it on your search interface page,
perhaps like this:

```html
<script src="jquery.js"></script>
<script src="jquery.gsa-clicks.min.js"></script>
<script>
jQuery(function($) {
  $('a').gsaClicks({
    host: 'https://gsa.example.com',
    collection: 'default_collection',
    query: 'example query',
    start: 0,
    clickTypes: {
      c: '.gsa-result a',
      logo: 'a#logo'
    }
  });
});
</script>
```

## Usage

#### Initializing click-tracking

You can initialize the plugin anywhere in your code after jQuery's been loaded.
You may wish to initialize after DOM ready, like so:

```javascript
(function($) {
  $(document).ready(function() {
    // Initialize the plugin for all anchor tags, with a set of options.
    ('a').gsaClicks({
      // At a minimum, specify a host, collection, query, and start.
      host: 'https://gsa.example.com',
      collection: 'default_collection',
      query: 'search query',
      start: 0
    });
  });
})(jQuery);
```

This ensures all anchors on the page will send click tracking data to the GSA
when clicked by a user. In order to codify the clicks more precisely, you must
specify clickType data.

Note that the act of initializing the plugin automatically fires a "load" event
to the GSA. No need to do so yourself.


#### Defining click types

The GSA recognizes a predefined set of click types (a full list of which is
available [in the GSA documentation](), or in the Appendix, below). This plugin
allows you to define which anchors are associated with corresponding click types
using the "clickType" property during initialization.

For example:

```javascript
(function($) {
  $(document).ready(function() {
    // Initialize the plugin for all anchor tags, with a set of options.
    ('a').gsaClicks({
      // Host, collection, query, start configuration omitted.
      clickTypes: {
        c: '.gsa-results .result-set a',
        keymatch: '.gsa-results .keymatch a',
        onebox: '.gsa-results .onebox a'
      }
    });
  });
})(jQuery);
```

More generally, the clickTypes object takes GSA click types as keys and a jQuery
selector as a value. The plugin is smart enough to automatically determine and
pass a "rank" value (if applicable) as well as URL data for each anchor clicked
by a user.

The GSA will also accept custom click types, which you can define the same way
as those in the predefined list.

Any anchors clicked that do not match a selector will be sent with a click type
of "OTHER."

For best results, you should be as thorough as possible in your click type
selection definitions.


#### Passing click data

It's also possible to pass additional data to the GSA with each click (useful
for more advanced reporting). To do so, you can pass in an anonymous function
in your initialization that handles click data retrieval on a case-by-case
basis.

For example:

```javascript
(function($) {
  $(document).ready(function() {
    // Initialize the plugin for all anchor tags, with a set of options.
    ('a').gsaClicks({
      // Host, collection, query, start configurations omitted.
      clickTypes: {
        cd: '.gsa-results .cluster a'
      },
      clickData: function($element, clickType) {
        switch (clickType) {
          case 'cd':
            return $element.innerHTML;
            break;
        }
      }
    });
  });
})(jQuery);
```

In the above example, the HTML contents of the anchor would be passed to GSA as
click data for clusters.


## Appendix

#### Predefined click types known to the GSA

| Click type   | Description                               |
|--------------|-------------------------------------------|
| advanced     | Advanced search link on the search page   |
| advanced_swr | Advanced search for anchor text           |
| c            | Search result                             |
| cache        | Cached document on results page           |
| cluster      | Cluster label on results page             |
| db           | Database content on results page          |
| desk.groups  | Groups link at the top of the search page |
| desk.images  | Images link at the top of the search page |
| desk.local   | Local link at the top of the search page  |
| desk.news    | News link at the top of the search page   |
| desk.web     | Web link at the top of the search page    |
| help         | Search Tips link on the search page       |
| keymatch     | Keymatch on results page                  |
| load         | Load results page                         |
| logo         | Hyperlinked logo                          |
| nav.next     | Navigation, next page                     |
| nav.page     | Navigation, specific page                 |
| nav.prev     | Navigation, previous page                 |
| onebox       | OneBox on results page                    |
| sitesearch   | More results from... link on results page |
| sort         | Sort link on results page                 |
| spell        | Spelling suggestion                       |
| synonym      | Related query on results page             |
| OTHER        |                                           |

[in the GSA documentation]: http://www.google.com/support/enterprise/static/gsa/docs/admin/70/gsa_doc_set/admin_searchexp/ce_improving_search.html#1034719
