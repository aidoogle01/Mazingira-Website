/* Mazingira Safari helpers: plain JavaScript, no framework. Assigns window.Mazingira. */
(function () {
  // Real coordinates (decimal degrees) of the places Mazingira's itineraries visit.
  var PLACES = {
    'arusha':       { name: 'Arusha',            lat: -3.37, lon: 36.68 },
    'kilimanjaro':  { name: 'Kilimanjaro Airport', lat: -3.43, lon: 37.07 },
    'tarangire':    { name: 'Tarangire',         lat: -3.95, lon: 36.05 },
    'lake-manyara': { name: 'Lake Manyara',      lat: -3.53, lon: 35.82 },
    'karatu':       { name: 'Karatu',            lat: -3.34, lon: 35.67 },
    'ngorongoro':   { name: 'Ngorongoro Crater', lat: -3.20, lon: 35.53 },
    'ndutu':        { name: 'Ndutu',             lat: -3.00, lon: 34.98 },
    'serengeti':    { name: 'Central Serengeti', lat: -2.43, lon: 34.82 },
    'north-serengeti': { name: 'Northern Serengeti', lat: -1.62, lon: 34.90 },
    'lake-natron':  { name: 'Lake Natron',       lat: -2.42, lon: 36.00 },
    'zanzibar':     { name: 'Zanzibar',          lat: -6.16, lon: 39.20, offMap: true }
  };
  // Map frame: northern Tanzania. Zanzibar sits off the frame and is drawn as a flight leaving the edge.
  var FRAME = { west: 34.5, east: 37.4, north: -1.35, south: -4.25 };
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /**
   * Draw a trip's route. `stops` is an ordered list of place keys (see PLACES);
   * prefix a key with "fly:" when that leg is a flight, e.g. ['arusha','tarangire','fly:zanzibar'].
   * Options: { width: 640, height: 440, title: 'Route of …', animate: true }
   */
  function routeMap(container, stops, opts) {
    opts = opts || {};
    var W = opts.width || 640, H = opts.height || 440, pad = 28;
    var x = function (lon) { return pad + (lon - FRAME.west) / (FRAME.east - FRAME.west) * (W - 2 * pad); };
    var y = function (lat) { return pad + (FRAME.north - lat) / (FRAME.north - FRAME.south) * (H - 2 * pad); };
    var pt = function (key) {
      var p = PLACES[key];
      if (p.offMap) return { x: W - 4, y: H - 4, p: p };
      return { x: x(p.lon), y: y(p.lat), p: p };
    };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'mz-route', role: 'img' });
    el('title', {}, svg).textContent = opts.title || 'Route map';

    var legs = stops.map(function (s) { return { key: s.replace(/^fly:/, ''), fly: /^fly:/.test(s) }; });
    var visited = {};
    legs.forEach(function (l) { visited[l.key] = true; });

    // landmarks not on this route, quietly
    Object.keys(PLACES).forEach(function (k) {
      if (visited[k] || PLACES[k].offMap) return;
      var q = pt(k);
      el('circle', { cx: q.x, cy: q.y, r: 3, class: 'mz-route__landmark' }, svg);
    });

    // the route, one segment per leg so flights can be dashed
    var segs = [];
    for (var i = 1; i < legs.length; i++) {
      var a = pt(legs[i - 1].key), b = pt(legs[i].key);
      if (a.x === b.x && a.y === b.y) continue;
      if (legs[i].fly) {
        // flights arc away from the road route so they don't cross it
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
        var cx = mx + dy * 0.35, cy = my - dx * 0.35;
        if (cy > my) { cx = mx - dy * 0.35; cy = my + dx * 0.35; }
        segs.push(el('path', { d: 'M' + a.x + ' ' + a.y + ' Q' + cx + ' ' + cy + ' ' + b.x + ' ' + b.y,
          class: 'mz-route__leg mz-route__leg--fly' }, svg));
      } else {
        segs.push(el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'mz-route__leg' }, svg));
      }
    }

    // stops and labels
    var seen = {};
    legs.forEach(function (l, idx) {
      if (seen[l.key]) return; seen[l.key] = true;
      var q = pt(l.key);
      if (q.p.offMap) {
        var t = el('text', { x: W - 10, y: H - 22, 'text-anchor': 'end', class: 'mz-route__label' }, svg);
        t.textContent = q.p.name + ' (flight)';
        return;
      }
      el('circle', { cx: q.x, cy: q.y, r: idx === 0 ? 6 : 5, class: 'mz-route__stop' }, svg);
      var left = q.x > W * 0.7;
      var lab = el('text', { x: q.x + (left ? -10 : 10), y: q.y + 5, 'text-anchor': left ? 'end' : 'start', class: 'mz-route__label' }, svg);
      lab.textContent = q.p.name;
    });

    container.appendChild(svg);

    // The one motion moment: the route draws once, leg by leg, when it scrolls into view.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (opts.animate !== false && !reduce && 'IntersectionObserver' in window) {
      segs.forEach(function (s) {
        var len = s.getTotalLength ? s.getTotalLength() : 0;
        s.style.setProperty('--len', len);
        s.classList.add('mz-route__leg--pending');
      });
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        segs.forEach(function (s, i) { s.style.animationDelay = (i * 0.35) + 's'; s.classList.add('mz-route__leg--draw'); });
        io.disconnect();
      }, { threshold: 0.35 });
      io.observe(svg);
    }
    return svg;
  }

  /** Twelve-month strip. `best` is a list like ['jun','jul','aug','sep'] (trip.best_time.months). */
  function monthStrip(container, best, opts) {
    opts = opts || {};
    var M = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    var N = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var ol = document.createElement('ol');
    ol.className = 'mz-months';
    ol.setAttribute('aria-label', opts.label || 'Best months to travel');
    M.forEach(function (m, i) {
      var li = document.createElement('li');
      var good = best.indexOf(m) !== -1;
      li.className = 'mz-months__m' + (good ? ' is-best' : '');
      li.textContent = N[i];
      if (good) li.setAttribute('aria-label', N[i] + ', best time');
      ol.appendChild(li);
    });
    container.appendChild(ol);
    return ol;
  }

  window.Mazingira = { PLACES: PLACES, routeMap: routeMap, monthStrip: monthStrip };
})();
