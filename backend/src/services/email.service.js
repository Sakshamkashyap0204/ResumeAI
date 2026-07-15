'use strict';

const nodemailer = require('nodemailer');
const env = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }

  async _send({ to, subject, html }) {
    await this.transporter.sendMail({
      from: `"Muse" <${env.smtp.from}>`,
      to,
      subject,
      html,
    });
  }

  async sendVerificationOtp(email, name, otp) {
    await this._send({
      to: email,
      subject: 'Verify your Muse account',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f11;color:#f4f4f5;border-radius:12px;">
          <div style="margin-bottom:24px;">
            <span style="background:#7c6af7;color:#fff;padding:6px 14px;border-radius:8px;font-weight:600;font-size:14px;">Muse</span>
          </div>
          <h2 style="font-size:20px;font-weight:600;margin:0 0 8px;">Verify your email</h2>
          <p style="color:#a1a1aa;font-size:14px;margin:0 0 24px;">Hi ${name}, use the code below to verify your account.</p>
          <div style="background:#18181b;border:1px solid #2e2e35;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#7c6af7;">${otp}</span>
          </div>
          <p style="color:#52525b;font-size:12px;margin:0;">This code expires in <strong style="color:#a1a1aa;">15 minutes</strong>. If you didn't create an account, ignore this email.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetOtp(email, name, otp) {
    await this._send({
      to: email,
      subject: 'Reset your Muse password',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f11;color:#f4f4f5;border-radius:12px;">
          <div style="margin-bottom:24px;">
            <span style="background:#7c6af7;color:#fff;padding:6px 14px;border-radius:8px;font-weight:600;font-size:14px;">Muse</span>
          </div>
          <h2 style="font-size:20px;font-weight:600;margin:0 0 8px;">Reset your password</h2>
          <p style="color:#a1a1aa;font-size:14px;margin:0 0 24px;">Hi ${name}, use the code below to reset your password.</p>
          <div style="background:#18181b;border:1px solid #2e2e35;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#7c6af7;">${otp}</span>
          </div>
          <p style="color:#52525b;font-size:12px;margin:0;">This code expires in <strong style="color:#a1a1aa;">15 minutes</strong>. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  }
}

module.exports = new EmailService();
