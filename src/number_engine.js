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

    // Corrected 2026-09-19 (published Garo dictionary, photographed
    // page: "Ritcha, adj. A hundred" / "Ritchasa, adj. One hundred" --
    // two distinct headwords). My 2026-09-18 fix wrongly conflated
    // this bare (no-classifier) number word with the classifier-
    // composition example ("achak mangritcha") and set this to
    // "Ritcha" -- that classifier example is still correct (it fuses
    // onto the generic root "Ritcha", matching its dictionary sense
    // "a hundred"), but the bare standalone number 100 is its own
    // headword, "Ritchasa" ("one hundred"), distinct from the generic
    // root. Confirmed instruction for the remainder: 101 = 100's word
    // + a further fused "sa" ("Ritchasasa"), same fuse-no-gap
    // mechanism as before, just building on the correct 100 base.
    // hundreds>1 (200, 300...) deliberately still composes with the
    // generic "Ritcha" root, not "Ritchasa" -- unconfirmed either way,
    // kept as the more linguistically consistent reading (Ritchasa
    // already means "one hundred", so "two Ritchasa" would double up
    // the "one"), not re-derived from new data.
    let result = hundreds === 1 ? "Ritchasa" : `${toGaroNumber(hundreds)} Ritcha`;

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
