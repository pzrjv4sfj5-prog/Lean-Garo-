export const BASE = {
  1: "Sa",
  2: "Gni",
  3: "Gittam",
  4: "Bri",
  5: "Bonga",
  6: "Dok",
  7: "Sni",
  8: "Chet",
  9: "Sku",
  10: "Chiking",
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
    return "Chi" + BASE[n - 10];
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

    let result = "";

    if (hundreds === 1) {
      result = "Ritchasa";
    } else {
      result = `${toGaroNumber(hundreds)} Ritchasa`;
    }

    if (remainder > 0) {
      result += ` ${toGaroNumber(remainder)}`;
    }

    return result;
  }

  if (n >= 1000) {

    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;

    let result = "";

    if (thousands === 1) {
      result = "Hajalsa";
    } else {
      result = `${toGaroNumber(thousands)} Hajalsa`;
    }

    if (remainder > 0) {
      result += ` ${toGaroNumber(remainder)}`;
    }

    return result;
  }

  return String(n);
}
