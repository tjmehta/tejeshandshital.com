'use strict';
var exists = require('101/exists');
var last = require('101/last');
var not = require('101/not');
var empty = require('101/is-empty');
var debug = require('auto-debug')();
var escapeRegExp = require('escape-regexp');
var capitalize = require('i')().titleize;

module.exports = parseName;

function parseName (name) {
  var out = {
    // names
    // lastName
    // nick
    // incomplete
  };
  // find any hints
  out.hint = findHint(name);
  if (out.hint) {
    name = name.replace(out.hint, '');
  }
  // format names w/in name
  var names = name
    .split(/[,\/\- ]+and[ ]?|[ ]*[,\/\-+&\(][ ]*/).map(trim);
  var titleAll, lastName;
  out.names = names.reverse().reduce(formatNames, []).reverse();
  function formatNames (betterNames, name) {
    var split = name.split(/[ ]+/i)
      .map(replace(/family/i, ''))
      .filter(exists);
    if (!titleAll) {
      if (/^dr.{0,2}s[. ]?/i.test(split[0])) {
        // title found, remove it from split
        split.shift();
        titleAll = true;
        betterNames = betterNames.map(prepend('Dr. '));
      }
      else if (/^dr/i.test(split[0])) {
        split.shift();
        split[0] = prepend(split[0], 'Dr. ');
      }
      else if (split.length >= 2) {
        var match = split[0].match(/^sri$/i);
        if (match) {
          var title = match[0];
          split.shift();
          split[0] = capitalize(title) + ' ' + split[0];
        }
      }
    }
    debug(titleAll, split);
    if (titleAll) {
      split[0] = prepend(split[0], 'Dr. ');
    }
    out.incomplete = out.incomplete || /\?|family|husban/i.test(name);
    debug('before truthy filter', split);
    split = split
      .map(replace(/[^.a-z ]/gi, ''))
      .filter(truthy);
    debug('truthy', split[0], truthy(split[0]), split);
    if (!lastName) {
      if (split.length >= 2) {
        lastName = out.lastName = capitalize(last(split));
        // last name found,
        // append it to names already found
        betterNames = betterNames
          .map(trim)
          .filter(not(empty))
          .map(append(' '+lastName));
      }
    }
    // debug(names.concat(split))
    if (split.length > 2) {
      out.incomplete = true;
    }
    if (split.length) {
      name = split.join(' ');
      if (lastName) {
        name = append(name, ' ' + lastName);
      }
      betterNames = betterNames.concat(name);
    }
    return betterNames;
  }
  debug('--------------->');
  debug('in :', name);
  debug('out:', out.names);
  debug('<---------------');

  return out;
}
function trim (name) {
  return name.trim();
}
function prepend (pre, str) {
  if (arguments.length === 2) {
    str = pre;
    pre = arguments[1];
    return _prepend(str);
  }
  return _prepend;
  function _prepend (str) {
    var re = new RegExp('^'+escapeRegExp(pre), 'i');
    return re.test(str) ?
      str : pre + str;
  }
}
function append (post) {
  if (arguments.length === 2) {
    // (str, post)
    var str = post;
    post = arguments[1];
    return _append(str);
  }
  return _append;
  function _append (str) {
    var re = new RegExp(escapeRegExp(post)+'$', 'i');
    debug('append!',re, post, str, re.test(str), str.length);
    return re.test(str) ?
      str : str + post;
  }
}
function replace (re, str) {
  return function (item) {
    return item.replace(re, str);
  };
}
function truthy (item) {
  return !!item;
}
function findHint (name) {
  if (/\(.+ and [^(]+[\) ]?/.test(name)) {
    return; // not a hint
  }
  var match = name.match(/\([^(]+[\) ]?/);
  if (match) {
    return match[0];
  }
  match = name.match(/with .*$/);
  if (match) {
    return match[0];
  }
}
