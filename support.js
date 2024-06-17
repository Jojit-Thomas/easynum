document.addEventListener("DOMContentLoaded", function () {
  const supportButton = document.getElementById("supportButton");
  const supportChatContainer = document.getElementById("supportChatContainer");
  const closeButton = document.getElementById("closeButton");
  const backdrop = document.getElementById("backdrop");
  const successModal = document.getElementById("successModal");
  const errorModal = document.getElementById("errorModal");
  const closeSuccessModal = document.getElementById("closeSuccessModal");
  const closeErrorModal = document.getElementById("closeErrorModal");

  supportButton.onclick = function () {
    supportChatContainer.classList.remove("translate-y-full");
    backdrop.classList.remove("hidden");
  };

  closeButton.onclick = function () {
    supportChatContainer.classList.add("translate-y-full");
    backdrop.classList.add("hidden");
  };

  closeSuccessModal.onclick = function () {
    successModal.classList.add("hidden");
    backdrop.classList.add("hidden");
  };

  closeErrorModal.onclick = function () {
    errorModal.classList.add("hidden");
  };

  // Optional: Handle sending messages
  const sendButton = document.getElementById("sendButton");
  sendButton.onclick = function () {
    console.log("Send button clicked");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key":
          "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",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name,
          email,
        },
        to: [
          {
            email: "thomasjojit@gmail.com",
            name: "Jojit Thomas",
          },
        ],
        subject: "Support Request",
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
    })
      .then((response) => {
        if (response.ok) {
          successModal.classList.remove("hidden");
          supportChatContainer.classList.add("translate-y-full");
        } else {
          errorModal.classList.remove("hidden");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        errorModal.classList.remove("hidden");
      });
  };
});
