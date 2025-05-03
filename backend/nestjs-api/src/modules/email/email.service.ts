// import { EmailService } from './email.service';
// email.service.ts
import { HttpException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { userVerifyEmail } from './email.templates/verify-email.template';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get<string>('EMAIL_USER') || process.env.EMAIL_USER,
        pass: configService.get<string>('EMAIL_PASS') || process.env.EMAIL_PASS,
      },
    });
  }

  async verifyEmail(name: string, email: string, resetLink: string) {
    const htlm = userVerifyEmail(name, email, resetLink);
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: htlm,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info.response;
    } catch (error) {
      //   throw new HttpException('Error sending email: ' + error.message);
      throw new HttpException('Error sending email: ' + error.message, 500);
    }
  }
}
