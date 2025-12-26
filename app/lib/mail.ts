import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { string } from 'zod/v4';

const OAuth2 = google.auth.OAuth2;

export const sendMail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
    try {
        const oauth2client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const accessToken = await oauth2client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token || ''
            }
        } as any);

        const mailOptions = {
            form: `Pulso Logístico <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(result, 'resultado de envio de email');
        return result;
    } catch (error) {
        console.error("error enviando correo", error);
        throw error;
    }
};