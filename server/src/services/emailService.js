import nodemailer from "nodemailer";

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  const isGmail =
    process.env.SMTP_SERVICE === "gmail" ||
    (!process.env.SMTP_HOST && user.includes("@gmail.com")) ||
    process.env.SMTP_HOST === "smtp.gmail.com";

  if (isGmail) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  } else {
    const port = Number(process.env.SMTP_PORT) || 465;
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return cachedTransporter;
};

export const sendPasswordResetEmail = async ({
  to,
  resetCode,
  username,
  lang = "uk",
}) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `⚠️ [SMTP WARNING] SMTP_USER or SMTP_PASS is not configured in .env! Email cannot be dispatched. (Code for ${to}: ${resetCode})`,
    );
    const error = new Error(
      "SMTP server is not configured. Please set SMTP_USER and SMTP_PASS in server/.env",
    );
    error.code = "SMTP_NOT_CONFIGURED";
    throw error;
  }

  const fromAddress =
    process.env.EMAIL_FROM ||
    `"Defilicious" <${process.env.SMTP_USER}>`;

  const isUk = String(lang).toLowerCase().startsWith("uk");
  const displayName = username || (isUk ? "користувачу" : "Customer");

  const strings = isUk
    ? {
        subject: `🔐 Defilicious — Код підтвердження: ${resetCode}`,
        securityBadge: "ПЕРЕВІРКА БЕЗПЕКИ",
        title: "Скидання пароля",
        greeting: `Вітаємо, <strong style="color: #ffffff;">${displayName}</strong>!`,
        intro:
          "Ми отримали запит на скидання пароля вашого облікового запису Defilicious.",
        prompt:
          "Введіть цей 6-значний код підтвердження в додатку, щоб продовжити:",
        warning:
          "⏳ Цей код дійсний протягом <strong>15 хвилин</strong>. Ніколи не передавайте його стороннім особам.",
        ignoreNote:
          "Якщо ви не надсилали запит на скидання пароля, просто проігноруйте цей лист. Ваш пароль залишиться без змін.",
        footer: `© ${new Date().getFullYear()} Defilicious. Всі права захищено.`,
        plainText: `Вітаємо, ${displayName}!\n\nМи отримали запит на скидання пароля вашого облікового запису Defilicious.\n\nВаш 6-значний код підтвердження: ${resetCode}\n\nКод дійсний 15 хвилин.\nЯкщо ви не надсилали цей запит, проігноруйте цей лист.\n\nЗ повагою,\nКоманда Defilicious`,
      }
    : {
        subject: `🔐 Defilicious — Your verification code: ${resetCode}`,
        securityBadge: "SECURITY VERIFICATION",
        title: "Password Reset Request",
        greeting: `Hello, <strong style="color: #ffffff;">${displayName}</strong>!`,
        intro:
          "We received a request to reset your Defilicious account password.",
        prompt: "Enter this 6-digit verification code in the app to continue:",
        warning:
          "⏳ This code is valid for <strong>15 minutes</strong>. Never share this code with anyone.",
        ignoreNote:
          "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
        footer: `© ${new Date().getFullYear()} Defilicious. All rights reserved.`,
        plainText: `Hello ${displayName},\n\nYou requested a password reset for your Defilicious account.\n\nYour 6-digit verification code is: ${resetCode}\n\nThis code will expire in 15 minutes.\n\nIf you did not make this request, please ignore this email.\n\nBest regards,\nThe Defilicious Team`,
      };

  const mailOptions = {
    from: fromAddress,
    to,
    subject: strings.subject,
    text: strings.plainText,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${strings.title}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #070d1a; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070d1a; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111c31; border-radius: 20px; border: 1px solid #1f2b44; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(2, 6, 23, 0.65);">
                  
                  <!-- Brand Header with Defilicious Identity -->
                  <tr>
                    <td style="padding: 36px 32px 24px; text-align: center; border-bottom: 1px solid #1f2b44; background: linear-gradient(180deg, rgba(238, 241, 111, 0.09) 0%, rgba(17, 28, 49, 0) 100%);">
                      <div style="font-size: 30px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1;">
                        Defilicious<span style="color: #eef16f;">.</span>
                      </div>
                      <div style="display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 700; color: #eef16f; background: rgba(238, 241, 111, 0.12); border: 1px solid rgba(238, 241, 111, 0.25); border-radius: 9999px; padding: 4px 12px; text-transform: uppercase; letter-spacing: 1.2px;">
                        ${strings.securityBadge}
                      </div>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 32px 32px 28px;">
                      <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em;">
                        ${strings.title}
                      </h2>
                      
                      <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                        ${strings.greeting} ${strings.intro}
                      </p>

                      <p style="margin: 0 0 20px; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                        ${strings.prompt}
                      </p>

                      <!-- Defilicious Code Display Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                        <tr>
                          <td align="center" style="background-color: #070d1a; border: 2px dashed #eef16f; border-radius: 16px; padding: 22px 16px; box-shadow: 0 8px 24px rgba(2, 6, 23, 0.4);">
                            <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #eef16f; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; display: inline-block; margin-left: 10px;">
                              ${resetCode}
                            </span>
                          </td>
                        </tr>
                      </table>

                      <!-- Expiry / Security Note -->
                      <div style="background-color: rgba(238, 241, 111, 0.05); border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; border-left: 3px solid #eef16f;">
                        <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
                          ${strings.warning}
                        </p>
                      </div>

                      <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                        ${strings.ignoreNote}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 32px; background-color: #0a1222; text-align: center; border-top: 1px solid #1f2b44;">
                      <p style="margin: 0; font-size: 12px; color: #64748b; letter-spacing: 0.2px;">
                        ${strings.footer}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
