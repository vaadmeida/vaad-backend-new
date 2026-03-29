import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTemplateService {
  getSignUp(verificationLink: string) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    /* Basic resets for email clients */
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { padding: 40px 20px; text-align: center; background-color: #4f46e5; color: #ffffff; }
    .content { padding: 40px; color: #334155; line-height: 1.6; }
    .button-container { text-align: center; padding: 20px 0; }
    .button { background-color: #4f46e5; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
    .link-alt { word-break: break-all; color: #6366f1; font-size: 13px; }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="header">
              <h1 style="margin: 0; font-size: 24px;">Welcome to [App Name]!</h1>
            </td>
          </tr>
          <tr>
            <td class="content">
              <p style="font-size: 18px; margin-top: 0;"><strong>Hi {{name}},</strong></p>
              <p>Thanks for signing up! We're excited to have you on board. To complete your registration and secure your account, please confirm your email address by clicking the button below:</p>
              
              <div class="button-container">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>

              <p>If the button above doesn't work, copy and paste this link into your browser:</p>
              <p class="link-alt">${verificationLink}</p>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="font-size: 14px; color: #64748b;">If you didn't create an account with us, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; 2026 VAAD Media. All rights reserved.</p>
              <p>123 Tech Lane, Innovation City</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}
