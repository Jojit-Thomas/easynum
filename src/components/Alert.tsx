import React from 'react';

interface AlertProps {
  alert: {
    visible: boolean;
    message: string;
  };
  setAlert: React.Dispatch<React.SetStateAction<{ visible: boolean; message: string; }>>;
}

const Alert: React.FC<AlertProps> = ({ alert, setAlert }) => {
  if (!alert.visible) return null;

  return (
    <div className="px-4 py-3 bg-gray-100 rounded-lg shadow-sm text-gray-800 mb-4 flex items-center justify-between" role="alert">
      <div className="flex items-center">
        <span>{alert.message}</span>
      </div>
      <button className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={() => setAlert((prev) => ({ ...prev, visible: false }))}>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default Alert;
