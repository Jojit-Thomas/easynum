export async function fetchCountryCode() {
  try {
    const response = await fetch('https://ip2c.org/s');
    const data = await response.text();
    const result = data.split(';');
    return result[1];
  } catch (error) {
    console.error('Error fetching country code:', error);
    return null;
  }
}

export async function sendSupportEmail(name: string, email: string, message: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': import.meta.env.VITE_BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name, email },
      to: [{ email: 'thomasjojit@gmail.com', name: 'Jojit Thomas' }],
      subject: 'Support Request',
      htmlContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>EasyNum Message</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border: 1px solid #ddd;
                    font-size: 14px;
                }
                .header {
                    background-color: #0073e6;
                    color: #fff;
                    padding: 10px;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    color: #666;
                    padding: 10px;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>EasyNum Message</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>${message}</p>
                    <p>From: ${name} (${email})</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 EasyNum. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}
