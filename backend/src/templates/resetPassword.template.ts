export const resetPasswordTemplate = (name: string, link: string) => `
  <div style="
      font-family: 'Segoe UI', Arial, sans-serif; 
      max-width: 600px; 
      margin: auto; 
      background: #ffffff; 
      border: 1px solid #eaeaea; 
      border-radius: 12px; 
      padding: 36px;
    ">

    <!-- Header -->
    <h2 style="text-align: center; margin-bottom: 24px; color: #111;">
      Reset your <span style="color: #6C5CE7;">PixelStock</span> password 🔐
    </h2>

    <!-- Greeting -->
    <p style="font-size: 15px; color: #333;">
      Hi <strong>${name}</strong>,
    </p>

    <!-- Message -->
    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We received a request to reset the password for your <strong>PixelStock</strong> account.
      If you made this request, please click the button below to choose a new password:
    </p>

    <!-- Button -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${link}"
            style="
              background: linear-gradient(90deg, #6C5CE7, #4B7BF5);
              color: #ffffff;
              padding: 14px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              display: inline-block;
            ">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiry Info -->
    <p style="font-size: 13px; color: #777;">
      This link will expire in <strong>24 hours</strong>.
      If you did not request a password reset, you can safely ignore this email
      and your password will remain unchanged.
    </p>

    <!-- Divider -->
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

    <!-- Footer -->
    <p style="font-size: 12px; color: #999; text-align: center; line-height: 1.5;">
      For your security, never share this email or your password with anyone.
    </p>

    <p style="font-size: 12px; color: #bbb; text-align: center; margin-top: 10px;">
      © ${new Date().getFullYear()} PixelStock. All rights reserved.
    </p>
  </div>
`;