import React, { useState } from 'react';
import { sendSupportEmail } from '../utils/api';

const SupportChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailStatus('sending');
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    try {
      await sendSupportEmail(name, email, message);
      setEmailStatus('success');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          id="supportButton"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          onClick={toggleChat}
        >
          Chat
        </button>
      </div>

      <div className={`fixed bottom-0 right-0 w-80 bg-white rounded-t-lg shadow-lg transition-all duration-300 ease-in-out ${isChatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold">Support Chat</h3>
          <button onClick={toggleChat} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSendEmail} className="p-4">
          <input type="text" name="name" placeholder="Your Name" required className="w-full p-2 mb-2 border rounded" />
          <input type="email" name="email" placeholder="Your Email" required className="w-full p-2 mb-2 border rounded" />
          <textarea name="message" placeholder="Your Message" required className="w-full p-2 mb-2 border rounded"></textarea>
          <button 
            type="submit" 
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${emailStatus === 'sending' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            disabled={emailStatus === 'sending'}
          >
            {emailStatus === 'sending' ? 'Sending...' : 'Send'}
          </button>
          {emailStatus === 'success' && <p className="text-green-500 mt-2">Email sent successfully!</p>}
          {emailStatus === 'error' && <p className="text-red-500 mt-2">Failed to send email. Please try again.</p>}
        </form>
      </div>
    </>
  );
};

export default SupportChat;
