export const userVerifyEmail = (
  name: string,
  email: string,
  verificationLink: string,
) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email - Model Repo</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #6E59A5;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }
        .content {
          padding: 20px;
          color: #333333;
        }
        .highlight-box {
          background-color: #D3E4FD;
          padding: 10px;
          border-radius: 6px;
          margin-top: 10px;
        }
        .verification-link {
          color: #6E59A5;
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          color: #888888;
          font-size: 12px;
          padding: 10px;
          background-color: #f9f9f9;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for signing up with the email address:</p>
          <div class="highlight-box">
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <p>Please verify your email address by clicking the link below:</p>
          <div class="highlight-box">
            <h3>
              <a href="${verificationLink}" class="verification-link">Verify Email</a>
            </h3>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>Welcome aboard!</p>
          <p>
            Best regards,<br />
            The Model Repo Team
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Model Repo. All rights reserved.</p>
          <p>
            Need help? Contact us at
            <a href="mailto:support@modelrepo.com">support@modelrepo.com</a>
          </p>
        </div>
      </div>
    </body>
  </html>
`;
