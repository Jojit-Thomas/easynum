import React, { useState, useEffect } from "react";
import { currencySymbols, currencyMap, formatNumberWithCommas, determineAutoFormat, convertNumberToReadableFormat, mapCurrency } from "../utils/currency";

interface EasyNumConverterProps {
  initialCurrency: string;
}

const EasyNumConverter: React.FC<EasyNumConverterProps> = ({ initialCurrency }) => {
  const [numberInput, setNumberInput] = useState<number | string>("");
  const [result, setResult] = useState("Formatted result will appear here");
  const [currency, setCurrency] = useState(initialCurrency);
  const [format, setFormat] = useState("auto");
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState("USD");
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCountryCode();
  }, []);

  useEffect(() => {
    formatNumber();
  }, [numberInput, currency, format, conversionRates]);

  useEffect(() => {
    fetchConversionRates();
  }, [currency]);

  const fetchCountryCode = () => {
    fetch("https://ip2c.org/s")
      .then((response) => response.text())
      .then((data) => {
        const result = data.split(";");
        const countryCode = result[1];
        if (countryCode) {
          const mappedCurrency = mapCurrency(countryCode);
          setDetectedCurrency(mappedCurrency);
          setCurrency(mappedCurrency);
        }
      })
      .catch((error) => console.error("Error fetching country code:", error));
  };

  const fetchConversionRates = async () => {
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-04-26/v1/currencies/${currency.toLowerCase()}.json`
      );
      const data = await response.json();
      setConversionRates(data[currency.toLowerCase()]);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const formatNumber = () => {
    const num = parseFloat(numberInput as string) || 0;
    const selectedFormat = format === "auto" ? determineAutoFormat(num, currency) : format;
    const formattedNumber = convertNumberToReadableFormat(num, selectedFormat);

    const targetCurrency = currency === "USD" ? "INR" : "USD";
    const conversionRate = conversionRates[targetCurrency.toLowerCase()] || 1;
    const convertedAmount = num * conversionRate;

    const convertedFormat = format === "auto" ? determineAutoFormat(convertedAmount, targetCurrency) : format;
    const formattedConvertedAmount = convertNumberToReadableFormat(convertedAmount, convertedFormat);

    setResult(
      num === 0
        ? "Formatted result will appear here"
        : `${currencySymbols[targetCurrency] || ""}${formatNumberWithCommas(formattedConvertedAmount, targetCurrency)} (${
            currencySymbols[currency] || ""
          }${formatNumberWithCommas(formattedNumber, currency)})`
    );
  };

  const getDisplayedCurrencies = () => {
    if (showAllCurrencies) {
      return Object.entries(currencyMap);
    } else {
      return [detectedCurrency === "USD" ? ["GBP", "GBP"] : ["USD", "USD"], [detectedCurrency, detectedCurrency]].filter(
        (item, index, self) => index === self.findIndex((t) => t[1] === item[1])
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="relative col-span-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">{currencySymbols[currency] || ""}</span>
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            placeholder="Enter a number"
            className="input w-full p-3 pl-10 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1">
          <div className="output w-full p-3 border border-gray-300 rounded-md bg-gray-100">{result}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="select w-full p-3 border border-gray-300 rounded-md">
            {getDisplayedCurrencies().map(([code, currencyCode]) => (
              <option key={code} value={currencyCode}>
                {currencyCode} ({currencySymbols[currencyCode]})
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="select w-full p-3 border border-gray-300 rounded-md">
            <option value="original">Original Number</option>
            <option value="thousand">Thousands</option>
            <option value="lakh">Lakhs</option>
            <option value="crore">Crores</option>
            <option value="million">Millions</option>
            <option value="billion">Billions</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <input
          id="showAllCurrencies"
          type="checkbox"
          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={showAllCurrencies}
          onChange={(e) => setShowAllCurrencies(e.target.checked)}
        />
        <label htmlFor="showAllCurrencies" className="text-sm text-gray-700">
          Show all currencies
        </label>
      </div>
    </>
  );
};

export default EasyNumConverter;