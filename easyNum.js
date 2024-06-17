function formatNumberWithCommas(num, format) {
  let [integerPart, decimalPart] = num.toString().split(".");
  decimalPart = decimalPart ? "." + decimalPart : "";
  
  // Use appropriate regex for USD and INR formats
  let regex = format === "usd" ? /\B(?=(\d{3})+(?!\d))/g : /(\d)(?=(\d\d)+\d$)/g;
  integerPart = integerPart.replace(regex, "$1,");
  
  return integerPart + decimalPart;
}

function determineAutoFormat(num, currency) {
  const thresholds = currency === "inr" ? [10000000, 100000, 1000] : [1000000000, 1000000, 1000];
  const formats = currency === "inr" ? ["crore", "lakh", "thousand"] : ["billion", "million", "thousand"];
  
  // Determine the appropriate format based on thresholds
  for (let i = 0; i < thresholds.length; i++) {
    if (num >= thresholds[i]) return formats[i];
  }
  
  return "original";
}

function convertNumberToReadableFormat(num, format) {
  const thresholds = { billion: 1e9, million: 1e6, crore: 1e7, lakh: 1e5, thousand: 1e3 };
  
  // Convert number to readable format
  return num >= thresholds[format] ? (num / thresholds[format]).toFixed(2) + ` ${format}` : num.toFixed(2);
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-04-26/v1/currencies/${fromCurrency}.json`
    );
    const data = await response.json();
    const rate = data[fromCurrency][toCurrency];
    
    return { rate, amount: (amount * rate).toFixed(2), symbol: toCurrency === "usd" ? "$" : "₹" };
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return { rate: 1, amount, symbol: "" };
  }
}

async function formatNumber() {
  const num = parseFloat(document.getElementById("numberInput").value) || 0;
  const currency = document.getElementById("currencySelect").value;

  // Determine and format the original number
  let originalFormat = determineAutoFormat(num, currency);
  let formattedNumber = convertNumberToReadableFormat(num, originalFormat);

  // Perform currency conversion and formatting
  let convertedAmount = await convertCurrency(num, currency, currency === "usd" ? "inr" : "usd");

  // Determine and format the converted amount
  let convertedFormat = determineAutoFormat(parseFloat(convertedAmount.amount), currency === "usd" ? "inr" : "usd");
  let formattedConvertedAmount = convertNumberToReadableFormat(parseFloat(convertedAmount.amount), convertedFormat);

  // Display the results
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
    resultDiv.textContent = `${convertedAmount.symbol}${formatNumberWithCommas(formattedConvertedAmount, currency)} (${currency === "inr" ? "₹" : "$"}${formatNumberWithCommas(formattedNumber, currency === "usd" ? "inr" : "usd")})`;
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
  const currency = document.getElementById("currencySelect").value;
  document.getElementById("currencySymbol").textContent = currency === "usd" ? "$" : "₹";
  formatNumber();
}