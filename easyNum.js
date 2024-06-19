const currencySymbols = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "KM",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "FBu",
  BMD: "$",
  BND: "$",
  BOB: "Bs.",
  BRL: "R$",
  BSD: "$",
  BTN: "Nu.",
  BWP: "P",
  BYN: "Br",
  BZD: "$",
  CAD: "$",
  CDF: "FC",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUP: "$",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "$",
  DZD: "د.ج",
  EGP: "£",
  ERN: "Nfk",
  ETB: "Br",
  EUR: "€",
  FJD: "$",
  FKP: "£",
  FOK: "kr",
  GBP: "£",
  GEL: "₾",
  GGP: "£",
  GHS: "₵",
  GIP: "£",
  GMD: "D",
  GNF: "FG",
  GTQ: "Q",
  GYD: "$",
  HKD: "$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "$",
  JOD: "د.ا",
  JPY: "¥",
  KES: "Sh",
  KGS: "с",
  KHR: "៛",
  KID: "$",
  KMF: "Fr",
  KRW: "₩",
  KWD: "د.ك",
  KYD: "$",
  KZT: "₸",
  LAK: "₭",
  LBP: "ل.ل",
  LKR: "Rs",
  LRD: "$",
  LSL: "L",
  LYD: "ل.د",
  MAD: "د.م.",
  MDL: "L",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "P",
  MRU: "UM",
  MUR: "₨",
  MVR: ".ރ",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "$",
  OMR: "ر.ع.",
  PAB: "B/.",
  PEN: "S/",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "ر.ق",
  RON: "lei",
  RSD: "дин",
  RUB: "₽",
  RWF: "FRw",
  SAR: "ر.س",
  SBD: "$",
  SCR: "₨",
  SDG: "£",
  SEK: "kr",
  SGD: "$",
  SHP: "£",
  SLE: "Le",
  SLL: "Le",
  SOS: "Sh",
  SRD: "$",
  SSP: "£",
  STN: "Db",
  SYP: "£",
  SZL: "L",
  THB: "฿",
  TJS: "ЅМ",
  TMT: "m",
  TND: "د.ت",
  TOP: "T$",
  TRY: "₺",
  TTD: "$",
  TVD: "$",
  TWD: "$",
  TZS: "Sh",
  UAH: "₴",
  UGX: "Sh",
  USD: "$",
  UYU: "$",
  UZS: "сўм",
  VES: "Bs.",
  VND: "₫",
  VUV: "Vt",
  WST: "T",
  XAF: "Fr",
  XCD: "$",
  XOF: "Fr",
  XPF: "Fr",
  YER: "﷼",
  ZAR: "R",
  ZMW: "ZK",
  ZWL: "$",
};

function formatNumberWithCommas(num, currency) {
  const [numericPart, suffix] = num.split(" ");
  let [integerPart, decimalPart] = numericPart.split(".");
  decimalPart = decimalPart ? "." + decimalPart : "";

  if (currency === "INR" && integerPart.length > 3) {
    let firstComma = integerPart.slice(-3);
    let remaining = integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    integerPart = remaining + "," + firstComma;
  } else {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return integerPart + decimalPart + (suffix ? " " + suffix : "");
}

function determineAutoFormat(num, currency) {
  const thresholds = currency === "INR" ? [10000000, 100000, 1000] : [1000000000, 1000000, 1000];
  const formats =
    currency === "INR" ? ["crore", "lakh", "thousand"] : ["billion", "million", "thousand"];

  for (let i = 0; i < thresholds.length; i++) {
    if (num >= thresholds[i]) return formats[i];
  }

  return "original";
}

function convertNumberToReadableFormat(num, format) {
  const thresholds = { billion: 1e9, million: 1e6, crore: 1e7, lakh: 1e5, thousand: 1e3 };

  return num >= thresholds[format]
    ? (num / thresholds[format]).toFixed(2) + ` ${format}`
    : num.toFixed(2);
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const [from, to] = [fromCurrency, toCurrency].map((currency) => currency.toLowerCase());
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-04-26/v1/currencies/${from}.json`
    );
    const data = await response.json();
    const rate = data[from][to];

    return { rate, amount: (amount * rate).toFixed(2), symbol: currencySymbols[toCurrency] || "" };
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return { rate: 1, amount, symbol: "" };
  }
}

async function formatNumber() {
  const num = parseFloat(document.getElementById("numberInput").value) || 0;
  const currency = document.getElementById("currencySelect").value.toUpperCase();
  const format = document.getElementById("formatSelect").value;

  let originalFormat = format === "auto" ? determineAutoFormat(num, currency) : format;
  let formattedNumber = convertNumberToReadableFormat(num, originalFormat);

  let convertedAmount = await convertCurrency(num, currency, currency === "USD" ? "INR" : "USD");

  let convertedFormat =
    format === "auto"
      ? determineAutoFormat(parseFloat(convertedAmount.amount), currency === "USD" ? "INR" : "USD")
      : format;
  let formattedConvertedAmount = convertNumberToReadableFormat(
    parseFloat(convertedAmount.amount),
    convertedFormat
  );

  displayResult(num, formattedNumber, currency, convertedAmount, formattedConvertedAmount);
}

function displayResult(num, formattedNumber, currency, convertedAmount, formattedConvertedAmount) {
  const resultDiv = document.getElementById("result");
  const numberInput = document.getElementById("numberInput");

  if (num === 0) {
    resultDiv.textContent = "Formatted result will appear here";
    resultDiv.classList.remove("roboto-value");
    resultDiv.classList.add("indie-flower-regular");
  } else {
    resultDiv.textContent = `${convertedAmount.symbol}${formatNumberWithCommas(
      formattedConvertedAmount,
      currency === "INR" ? "USD" : "INR"
    )} (${currencySymbols[currency] || ""}${formatNumberWithCommas(formattedNumber, currency)})`;
    resultDiv.classList.remove("indie-flower-regular");
    resultDiv.classList.add("roboto-value");
  }

  if (numberInput.value === "") {
    numberInput.classList.add("indie-placeholder");
    numberInput.classList.remove("roboto-regular");
  } else {
    numberInput.classList.remove("indie-placeholder");
    numberInput.classList.add("roboto-regular");
  }
}

function changeCurrency() {
  const currency = document.getElementById("currencySelect").value.toUpperCase();
  document.getElementById("currencySymbol").textContent = currencySymbols[currency] || "";
  formatNumber();
}
