const assert = require('node:assert/strict');
const { ageAt, japanDate, nextDayDelay } = require('../assets/site-dates.js');
const birth = '2023-07-13';
const cases = [
  ['2026-09-12T00:00:00+09:00', 3],
  ['2026-07-12T23:59:59+09:00', 2],
  ['2026-07-13T00:00:00+09:00', 3],
  ['2027-07-12T23:59:59+09:00', 3],
  ['2027-07-13T00:00:00+09:00', 4],
  ['2027-07-12T15:00:00Z', 4],
  ['2023-07-12T23:59:59+09:00', null],
  ['2023-07-13T00:00:00+09:00', 0],
];
for(const [date, age] of cases) assert.equal(ageAt(birth, new Date(date)), age, date);
assert.equal(ageAt('2023-02-30'), null);
assert.equal(ageAt('not-a-date'), null);
assert.equal(ageAt(birth, new Date('invalid')), null);
assert.equal(japanDate(new Date('2026-12-31T15:00:00Z')).year, 2027);
assert.equal(nextDayDelay(new Date('2026-12-31T14:59:59Z')), 1050);
console.log('PASS: 13 date cases, including birthday/year rollover at Japanese midnight.');
