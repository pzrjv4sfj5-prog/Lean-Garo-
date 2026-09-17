export const BASE = {
  1: "sa",
  2: "gni",
  3: "gittam",
  4: "bri",
  5: "bonga",
  6: "dok",
  7: "sni",
  8: "chet",
  9: "sku",
  10: "chiking",
};

export const TENS = {
  20: "Kolgrik",
  30: "Kolatchi",
  40: "Sotbri",
  50: "Sotbonga",
  60: "Sotdok",
  70: "Sotsni",
  80: "Sotchet",
  90: "Sotsku",
};

export function toGaroNumber(n) {

  n = Number(n);

  if (n <= 0) return "";

  if (BASE[n]) {
    return BASE[n];
  }

  if (n >= 11 && n <= 19) {
    // Native speaker confirmed 2026-06-28 the correct form is "Chi·" +
    // base digit (Chi·sa=11, Chi·gni=12, ... Chi·sku=19) — NOT
    // "chiking·ma·" as previously implemented here. See
    // garo_classifier.js's TEENS table, which already carries this fix;
    // this was RC-CANDIDATE-032 (this standalone function had drifted
    // out of sync with that correction).
    return "Chi·" + BASE[n - 10];
  }

  if (n >= 20 && n <= 99) {

    const tens = Math.floor(n / 10) * 10;
    const units = n % 10;

    if (units === 0) {
      return TENS[tens];
    }

    return `${TENS[tens]} ${toGaroNumber(units)}`;
  }

  if (n >= 100 && n <= 999) {

    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;

    // Fixed 2026-09-18 (direct Thangseng citation: 100 = "ritcha",
    // 101 = "ritchasa"). Previously this produced "ritchasa" for 100
    // itself (uncited, no confirmed source) and "ritchasa sa" for 101
    // (space-joined) -- both wrong per the citation: the bare hundred
    // word is just "Ritcha" alone, and any remainder fuses directly
    // onto it with no space, same fuse-no-gap mechanism used for
    // classifier compounds elsewhere in this codebase. Only n=101 is a
    // direct citation for the remainder-fusion behavior; extending it
    // to remainder values 2-99 is a mechanical generalization of that
    // same fuse mechanism, not independently confirmed for each value.
    let result = hundreds === 1 ? "Ritcha" : `${toGaroNumber(hundreds)} Ritcha`;

    if (remainder > 0) {
      result += toGaroNumber(remainder).replace(/\s+/g, '').toLowerCase();
    }

    return result;
  }

  if (n >= 1000) {

    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;

    let result = "";

    if (thousands === 1) {
      result = "hajalsa";
    } else {
      result = `${toGaroNumber(thousands)} hajalsa`;
    }

    if (remainder > 0) {
      result += ` ${toGaroNumber(remainder)}`;
    }

    return result;
  }

  return String(n);
}
