/* 2026年分・通常の年末調整/確定申告用。NTA 1410/1199、2026-11-08確認。
 * 11/30以前の死亡・出国、所得金額調整控除、分離課税等は対象外。 */
(function(root, factory){
  'use strict';
  var rules = factory();
  if(typeof module === 'object' && module.exports) module.exports = rules;
  else root.KazMioTax2026 = rules;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';
  function amount(v){ return Number.isFinite(Number(v)) ? Math.max(0, Math.floor(Number(v))) : 0; }
  function salaryIncome(v){
    var s = amount(v), a = Math.floor(s / 4000) * 4000;
    if(s < 741000) return 0;
    if(s < 2191000) return s - 740000;
    if(s < 2193000) return 1451000;
    if(s < 2196000) return 1453000;
    if(s < 2200000) return 1456000;
    if(s < 3600000) return Math.round(a * .7) - 80000;
    if(s < 6600000) return Math.round(a * .8) - 440000;
    if(s < 8500000) return Math.floor(s * .9) - 1100000;
    return s - 1950000;
  }
  function basicDeduction(v){
    var n = amount(v);
    if(n <= 4890000) return 1040000;
    if(n <= 6550000) return 670000;
    if(n <= 23500000) return 620000;
    if(n <= 24000000) return 480000;
    if(n <= 24500000) return 320000;
    if(n <= 25000000) return 160000;
    return 0;
  }
  function residentBasicDeduction(v){
    var n = amount(v);
    if(n <= 24000000) return 430000;
    if(n <= 24500000) return 290000;
    if(n <= 25000000) return 150000;
    return 0;
  }
  return Object.freeze({year:2026, residentYear:2027, dependentIncomeLimit:620000,
    salaryIncome:salaryIncome, basicDeduction:basicDeduction,
    residentBasicDeduction:residentBasicDeduction});
});
