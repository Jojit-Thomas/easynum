import React, { useState, useEffect } from 'react';
import { currencySymbols, currencyMap, formatNumberWithCommas, determineAutoFormat, convertNumberToReadableFormat, convertCurrency } from '../utils/currency';

interface EasyNumConverterProps {
  initialCurrency: string;
}

const EasyNumConverter: React.FC<EasyNumConverterProps> = ({ initialCurrency }) => {
  const [numberInput, setNumberInput] = useState<number | string>('');
  const [result, setResult] = useState('Formatted result will appear here');
  const [currency, setCurrency] = useState(initialCurrency);
  const [format, setFormat] = useState('auto');
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);

  useEffect(() => {
    formatNumber();
  }, [numberInput, currency, format]);

  const formatNumber = async () => {
    const num = parseFloat(numberInput as string) || 0;
    const selectedFormat = format === 'auto' ? determineAutoFormat(num, currency) : format;
    const formattedNumber = convertNumberToReadableFormat(num, selectedFormat);

    const convertedAmount = await convertCurrency(num, currency, currency === 'USD' ? 'INR' : 'USD');
    const convertedFormat = format === 'auto'
      ? determineAutoFormat(parseFloat(convertedAmount.amount), currency === 'USD' ? 'INR' : 'USD')
      : format;
    const formattedConvertedAmount = convertNumberToReadableFormat(parseFloat(convertedAmount.amount), convertedFormat);

    setResult(num === 0
      ? 'Formatted result will appear here'
      : `${convertedAmount.symbol}${formatNumberWithCommas(formattedConvertedAmount, currency === 'INR' ? 'USD' : 'INR')} (${currencySymbols[currency] || ''}${formatNumberWithCommas(formattedNumber, currency)})`
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="relative col-span-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            {currencySymbols[currency] || ''}
          </span>
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            placeholder="Enter a number"
            className="input w-full p-3 pl-10 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1">
          <div className="output w-full p-3 border border-gray-300 rounded-md bg-gray-100">
            {result}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="select w-full p-3 border border-gray-300 rounded-md"
          >
            {Object.entries(currencyMap).map(([code, currencyCode]) => (
              <option key={code} value={currencyCode}>
                {currencyCode}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="select w-full p-3 border border-gray-300 rounded-md"
          >
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
        <label htmlFor="showAllCurrencies" className="text-sm text-gray-700">Show all currencies</label>
      </div>
    </>
  );
};

export default EasyNumConverter;