import dom from './core'
import {
  assign,
  each
} from 'ilos'

export default assign(dom, {
  css(el, name, value) {
    let prop = /[_-]/.test(name) ? camelize(name) : name,
      hook

    name = cssName(prop) || prop
    hook = cssHooks[prop] || cssDefaultHook
    if (arguments.length == 2) {
      let convert = value,
        num;
      if (name === 'background')
        name = 'backgroundColor';
      value = hook.get(el, name);
      return convert !== false && isFinite((num = parseFloat(value))) ? num : value;
    } else if (!value && value !== 0) {
      el.style[name] = ''
    } else {
      if (isFinite(value) && !cssNumber[prop])
        value += 'px'
      hook.set(el, name, value)
    }
    return dom
  },
  position: function(el) {
    let _offsetParent, _offset,
      parentOffset = {
        top: 0,
        left: 0
      };
    if (dom.css(el, 'position') === 'fixed') {
      _offset = el.getBoundingClientRect();
    } else {
      _offsetParent = offsetParent(el);
      _offset = offset(el);
      if (_offsetParent.tagName !== 'HTML')
        parentOffset = offset(_offsetParent);
      parentOffset.top += dom.css(_offsetParent, 'borderTopWidth', true);
      parentOffset.left += dom.css(_offsetParent, 'borderLeftWidth', true);

      parentOffset.top -= dom.scrollTop(_offsetParent);
      parentOffset.left -= dom.scrollLeft(_offsetParent);
    }
    return {
      top: _offset.top - parentOffset.top - dom.css(el, 'marginTop', true),
      left: _offset.left - parentOffset.left - dom.css(el, 'marginLeft', true)
    }
  },
  scrollTop(el, val) {
    let win = getWindow(el);
    if (arguments.length == 1) {
      return (win ? 'scrollTop' in win ? win.scrollTop : root.pageYOffset : el.pageYOffset) || 0;
    } else if (win) {
      win.scrollTo(dom.scrollLeft(el), val);
    } else {
      el.pageYOffset = val;
    }
    return dom
  },

  scrollLeft(el, val) {
    let win = getWindow(el);
    if (arguments.length == 1) {
      return (win ? 'scrollLeft' in win ? win.scrollLeft : root.pageXOffset : el.pageXOffset) || 0;
    } else if (win) {
      win.scrollTo(val, dom.scrollTop(el));
    } else {
      el.pageXOffset = val;
    }
    return dom
  },

  scroll(el, left, top) {
    let win = getWindow(el);
    if (arguments.length == 1) {
      return {
        left: dom.scrollLeft(el),
        top: dom.scrollTop(el)
      }
    } else if (win) {
      win.scrollTo(left, top);
    } else {
      el.pageXOffset = left;
      el.pageYOffset = top;
    }
    return dom
  }
});

let cssFix = dom.cssFix = {
    'float': dom.W3C ? 'cssFloat' : 'styleFloat'
  },
  cssHooks = dom.cssHooks = {},
  cssDefaultHook = {},
  prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'],
  cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    order: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    fillOpacity: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
  },
  cssShow = {
    position: 'absolute',
    visibility: 'hidden',
    display: 'block'
  },
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  root = document.documentElement,
  css = dom.css;

function camelize(target) {
  if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
    return target
  }
  return target.replace(/[-_][^-_]/g, function(match) {
    return match.charAt(1).toUpperCase()
  });
}

function cssName(name, host, camelCase) {
  if (cssFix[name])
    return cssFix[name]
  host = host || root.style
  for (var i = 0, n = prefixes.length; i < n; i++) {
    camelCase = camelize(prefixes[i] + name)
    if (camelCase in host) {
      return (cssFix[name] = camelCase)
    }
  }
  return null
}
cssDefaultHook.set = function cssDefaultSet(el, name, value) {
  try {
    el.style[name] = value
  } catch (e) {}
}

let cssDefaultGet;
if (window.getComputedStyle) {
  cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
    let val,
      styles = getComputedStyle(el, null)

    if (styles) {
      val = name === 'filter' ? styles.getPropertyValue(name) : styles[name]
      if (val === '')
        val = el.style[name]
    }
    return val
  }
  cssHooks.opacity = {
    get(el, name) {
      let val = cssDefaultGet(el, name);
      return val === '' ? '1' : ret;
    }
  }
} else {
  let rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
    rposition = /^(top|right|bottom|left)$/,
    ralpha = /alpha\([^)]*\)/i,
    ie8 = !!window.XDomainRequest,
    salpha = 'DXImageTransform.Microsoft.Alpha',
    border = {
      thin: ie8 ? '1px' : '2px',
      medium: ie8 ? '3px' : '4px',
      thick: ie8 ? '5px' : '6px'
    }

  cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
    let currentStyle = el.currentStyle,
      val = currentStyle[name];

    if ((rnumnonpx.test(val) && !rposition.test(val))) {
      let style = el.style,
        left = style.left,
        rsLeft = el.runtimeStyle.left;

      el.runtimeStyle.left = currentStyle.left;
      style.left = name === 'fontSize' ? '1em' : (val || 0);
      val = style.pixelLeft + 'px';
      style.left = left;
      el.runtimeStyle.left = rsLeft;
    }
    if (val === 'medium') {
      name = name.replace('Width', 'Style');
      if (currentStyle[name] === 'none')
        val = '0px';
    }
    return val === '' ? 'auto' : border[val] || val;
  }
  cssHooks.opacity = {
    get(el, name) {
      let alpha = el.filters.alpha || el.filters[salpha],
        op = alpha && alpha.enabled ? alpha.opacity : 100;

      return (op / 100) + ''
    },
    set(el, name, value) {
      var style = el.style,
        opacity = isFinite(value) && value <= 1 ? `alpha(opacity=${value * 100})` : '',
        filter = style.filter || '';

      style.zoom = 1;
      style.filter = (ralpha.test(filter) ?
        filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();
      if (!style.filter)
        style.removeAttribute('filter');
    }
  }
}

each(['top', 'left'], function(name) {
  cssHooks[name] = {
    get(el, name) {
      let val = cssDefaultGet(el, name);
      return /px$/.test(val) ? val : dom.position(el)[name] + 'px'
    }
  }
})

each(['Width', 'Height'], function(name) {
  var method = name.toLowerCase(),
    clientProp = 'client' + name,
    scrollProp = 'scroll' + name,
    offsetProp = 'offset' + name,
    which = name == 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  function get(el, boxSizing) {
    let val;

    val = el[offsetProp] // border-box 0
    if (boxSizing === 2) // margin-box 2
      return val + css(el, 'margin' + which[0], true) + css(el, 'margin' + which[1], true);
    if (boxSizing < 0) // padding-box  -2
      val = val - css(el, 'border' + which[0] + 'Width', true) - css(el, 'border' + which[1] + 'Width', true);
    if (boxSizing === -4) // content-box -4
      val = val - css(el, 'padding' + which[0], true) - css(el, 'padding' + which[1], true);
    return val
  }

  dom[method] = function(el) {
    return get(el, -4);
  }

  dom['inner' + name] = function(el) {
    return get(el, -2);
  }
  dom['outer' + name] = function(el, includeMargin) {
    return get(el, includeMargin === true ? 2 : 0);
  }
})

function offsetParent(el) {
  var offsetParent = el.offsetParent
  while (offsetParent && css(offsetParent, "position") === "static") {
    offsetParent = offsetParent.offsetParent;
  }
  return offsetParent || root;
}

function offset(el) { //取得距离页面左右角的坐标
  var box = {
    left: 0,
    top: 0
  };

  if (!el || !el.tagName || !el.ownerDocument)
    return box;

  var doc = el.ownerDocument,
    body = doc.body,
    root = doc.documentElement,
    win = doc.defaultView || doc.parentWindow;

  if (!dom.inDoc(el, root))
    return box;

  if (el.getBoundingClientRect)
    box = el.getBoundingClientRect();

  var clientTop = root.clientTop || body.clientTop,
    clientLeft = root.clientLeft || body.clientLeft,
    scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
    scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  }
}

function getWindow(node) {
  return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
}
