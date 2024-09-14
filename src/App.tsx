import { useState, useEffect } from 'react';
import Alert from './components/Alert';
import EasyNumConverter from './components/EasyNumConverter';
import SupportChat from './components/SupportChat';
import { fetchCountryCode } from './utils/api';
import { mapCurrency } from './utils/currency';

function App() {
  const [alert, setAlert] = useState({
    visible: true,
    message: 'The site is in beta; full currency support is coming soon.',
  });
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function initCurrency() {
      const countryCode = await fetchCountryCode();
      if (countryCode) {
        setCurrency(mapCurrency(countryCode));
      }
    }
    initCurrency();
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg space-y-4">
        <Alert alert={alert} setAlert={setAlert} />
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 sofadi-one-">EasyNum</h1>
        <EasyNumConverter initialCurrency={currency} />
        <div className="text-right text-gray-500 text-sm mt-4 indie-flower-regular">
          Made with ❤️ by <a href="https://www.linkedin.com/in/jojitthomas/" className="underline">Jojit.in</a>
        </div>
      </div>
      <SupportChat />
    </div>
  );
}

export default App;
