(function () {
  'use strict';
  const DAY = 86400000;
  const JST = 9 * 60 * 60 * 1000;
  function japanDate(now = new Date()) {
    const local = new Date(now.getTime() + JST);
    return { year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate() };
  }
  function ageAt(birthday, now = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || !Number.isFinite(now.getTime())) return null;
    const [year, month, day] = birthday.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) return null;
    const today = japanDate(now);
    const age = today.year - year - (today.month < month || (today.month === month && today.day < day) ? 1 : 0);
    return age >= 0 ? age : null;
  }
  function nextDayDelay(now = new Date()) {
    return DAY - ((now.getTime() + JST) % DAY + DAY) % DAY + 50;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { japanDate, ageAt, nextDayDelay };
  if (typeof document === 'undefined') return;
  let timer;
  function update() {
    const now = new Date();
    document.querySelectorAll('[data-child-birthday]').forEach(el => {
      const age = ageAt(el.dataset.childBirthday, now);
      if (age !== null) el.textContent = age + '歳';
    });
    document.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = String(japanDate(now).year); });
    clearTimeout(timer);
    timer = setTimeout(update, nextDayDelay(now));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update, { once: true });
  else update();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  window.addEventListener('pageshow', update);
}());
