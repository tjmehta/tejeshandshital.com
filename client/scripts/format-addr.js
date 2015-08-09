'use strict';
var keypather = require('keypather')();

module.exports = formatAddr;

function formatAddr (addr) {
  var str = '';
  var patelMultiName = keypather.get(addr, 'invite.patel.multiName');
  var mehtaMultiName = keypather.get(addr, 'invite.mehta.multiName');
  if (addr.isRSVP) {
    var rsvp = addr;
    return 'Manual RSVP: ' + rsvp.nameStr;
  }
  if (addr.zip === '00000') {
    return ':' +
      (mehtaMultiName || patelMultiName);
  }
  str += (addr.number || '');
  str  = (str + ' ' + (addr.prefix || '')).trim();
  str  = (str + ' ' + addr.street + ' ' + (addr.type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_num  || '')).trim();
  str += ', ';
  str += (addr.city +', '+ addr.state +' '+ addr.zip);

  return str;
}