



(function() {
  /**
   * Toggle a sidebar panel.
   * @param {string} side - "left" or "right"
   */
  function toggleSidebar(side) {
    var sidebar = document.getElementById("pw-sidebar-" + side);
    var overlay = document.getElementById("pw-sidebar-overlay");
    if (!sidebar) return;

    var isOpen = (" " + sidebar.className + " ").indexOf(" is-open ") > -1;

    if (isOpen) {
      closeSidebar(side);
    } else {
      openSidebar(side);
    }
  }

  function openSidebar(side) {
    var sidebar = document.getElementById("pw-sidebar-" + side);
    var overlay = document.getElementById("pw-sidebar-overlay");
    if (!sidebar) return;
    addClass(sidebar, "is-open");
    if (overlay) addClass(overlay, "is-visible");
  }

  function closeSidebar(side) {
    var sidebar = document.getElementById("pw-sidebar-" + side);
    var overlay = document.getElementById("pw-sidebar-overlay");
    if (!sidebar) return;
    removeClass(sidebar, "is-open");
    if (overlay) removeClass(overlay, "is-visible");
  }

  function closeAllSidebars() {
    closeSidebar("left");
    closeSidebar("right");
  }

  /* --- CSS class helpers (no classList in ES3) --- */
  function hasClass(el, cls) {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }

  function addClass(el, cls) {
    if (!hasClass(el, cls)) {
      el.className = el.className ? el.className + " " + cls : cls;
    }
  }

  function removeClass(el, cls) {
    var re = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
    el.className = el.className.replace(re, " ").replace(/^\s+|\s+$/g, "");
  }

  /* --- Wire up event listeners --- */
  function addEvent(el, evt, fn) {
    if (el.addEventListener) {
      el.addEventListener(evt, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + evt, fn);
    }
  }

  function init() {
    var menuBtn = document.getElementById("pw-navbar-menu-btn");
    var tocBtn = document.getElementById("pw-navbar-toc-btn");
    var overlay = document.getElementById("pw-sidebar-overlay");

    if (menuBtn) {
      addEvent(menuBtn, "click", function() {
        toggleSidebar("left");
      });
    }

    if (tocBtn) {
      addEvent(tocBtn, "click", function() {
        toggleSidebar("right");
      });
    }

    if (overlay) {
      addEvent(overlay, "click", function() {
        closeAllSidebars();
      });
    }
  }

  /* Run on DOM ready */
  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    addEvent(document, "DOMContentLoaded", init);
  }

  /* Expose for external use if needed */
  window.PaperworkSidebar = {
    toggle: toggleSidebar,
    open: openSidebar,
    close: closeSidebar,
    closeAll: closeAllSidebars
  };
})();


(function() {

  /* --- CSS class helpers (ES3, no classList) --- */
  function hasClass(el, cls) {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }

  function addClass(el, cls) {
    if (!hasClass(el, cls)) {
      el.className = el.className ? el.className + " " + cls : cls;
    }
  }

  function removeClass(el, cls) {
    var re = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
    el.className = el.className.replace(re, " ").replace(/^\s+|\s+$/g, "");
  }

  function toggleClass(el, cls) {
    if (hasClass(el, cls)) {
      removeClass(el, cls);
    } else {
      addClass(el, cls);
    }
  }

  function addEvent(el, evt, fn) {
    if (el.addEventListener) {
      el.addEventListener(evt, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + evt, fn);
    }
  }

  /**
   * Initialize all TOC trees on the page.
   * Attaches click handlers to .pw-toc-toggle buttons.
   */
  function initTocTrees() {
    var toggles = document.getElementsByClassName
      ? document.getElementsByClassName("pw-toc-toggle")
      : getElementsByClassNameCompat("pw-toc-toggle");

    for (var i = 0; i < toggles.length; i++) {
      (function(btn) {
        addEvent(btn, "click", function(e) {
          /* Prevent navigation if the toggle is inside a link */
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          /* Toggle the parent .pw-toc-item */
          var item = btn.parentNode;
          if (item && hasClass(item, "pw-toc-item")) {
            toggleClass(item, "is-expanded");
          }
        });
      })(toggles[i]);
    }
  }

  /**
   * Expand tree nodes leading to the currently active link.
   * Looks for .pw-toc-link.is-active and expands all ancestor nodes.
   */
  function expandActiveNodes() {
    var activeLinks = document.getElementsByClassName
      ? document.getElementsByClassName("is-active")
      : getElementsByClassNameCompat("is-active");

    for (var i = 0; i < activeLinks.length; i++) {
      var node = activeLinks[i].parentNode;
      while (node) {
        if (node.className && hasClass(node, "pw-toc-item")) {
          addClass(node, "is-expanded");
        }
        node = node.parentNode;
      }
    }
  }

  /**
   * Fallback for getElementsByClassName (IE8 and older).
   */
  function getElementsByClassNameCompat(cls) {
    var results = [];
    var all = document.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
      if (hasClass(all[i], cls)) {
        results.push(all[i]);
      }
    }
    return results;
  }

  /* --- Initialize --- */
  function init() {
    initTocTrees();
    expandActiveNodes();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    addEvent(document, "DOMContentLoaded", init);
  }

  /* Expose API */
  window.PaperworkToc = {
    init: init,
    expandActive: expandActiveNodes
  };
})();


(function() {

  function addEvent(el, evt, fn) {
    if (el.addEventListener) {
      el.addEventListener(evt, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + evt, fn);
    }
  }

  /**
   * Navigate to the search results page with the query as a parameter.
   * @param {string} query
   */
  function performSearch(query) {
    query = query.replace(/^\s+|\s+$/g, ""); /* trim */
    if (!query) return;
    /* Navigate to search.html with query param */
    var baseUrl = document.getElementById("pw-search-base");
    var base = baseUrl ? baseUrl.getAttribute("data-url") : ".";
    window.location.href = base + "/search.html?q=" + encodeURIComponent(query);
  }

  /**
   * Attach submit behavior to a search input.
   * Triggers search on Enter key.
   */
  function bindSearchInput(inputId) {
    var input = document.getElementById(inputId);
    if (!input) return;

    addEvent(input, "keydown", function(e) {
      var key = e.which || e.keyCode;
      if (key === 13) { /* Enter */
        if (e.preventDefault) e.preventDefault();
        performSearch(input.value);
      }
    });
  }

  /**
   * Sync search inputs: typing in one updates the other.
   */
  function syncSearchInputs(id1, id2) {
    var input1 = document.getElementById(id1);
    var input2 = document.getElementById(id2);
    if (!input1 || !input2) return;

    addEvent(input1, "keyup", function() {
      input2.value = input1.value;
    });

    addEvent(input2, "keyup", function() {
      input1.value = input2.value;
    });
  }

  /* --- Initialize --- */
  function init() {
    bindSearchInput("pw-hero-search");
    bindSearchInput("pw-navbar-search");
    syncSearchInputs("pw-hero-search", "pw-navbar-search");
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    addEvent(document, "DOMContentLoaded", init);
  }

  window.PaperworkSearch = {
    search: performSearch
  };
})();


(function() {

  function addEvent(el, evt, fn) {
    if (el.addEventListener) {
      el.addEventListener(evt, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + evt, fn);
    }
  }

  function wrapTables() {
    var cards = document.getElementsByClassName
      ? document.getElementsByClassName("pw-card")
      : [];

    for (var c = 0; c < cards.length; c++) {
      var tables = cards[c].getElementsByTagName("table");
      /* Walk backwards because wrapping mutates the live collection */
      for (var t = tables.length - 1; t >= 0; t--) {
        var table = tables[t];
        /* Skip if already wrapped */
        if (table.parentNode && table.parentNode.className &&
            table.parentNode.className.indexOf("pw-table-wrap") > -1) {
          continue;
        }
        var wrapper = document.createElement("div");
        wrapper.className = "pw-table-wrap";
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    }
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    wrapTables();
  } else {
    addEvent(document, "DOMContentLoaded", wrapTables);
  }
})();