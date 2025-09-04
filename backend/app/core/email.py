import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from jinja2 import Template
from app.core.config import settings

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@gdprhub.com")
        self.app_name = "GDPR Hub Lite"
        self.app_url = os.getenv("APP_URL", "http://localhost:3000")
    
    def send_email(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None) -> bool:
        """Email gönderme"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Text content (optional)
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            # SMTP connection
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Email gönderme hatası: {e}")
            return False
    
    def send_magic_link(self, to_email: str, magic_link: str, redirect_url: Optional[str] = None) -> bool:
        """Magic link email gönderme"""
        subject = f"🔐 {self.app_name} - Giriş Linki"
        
        # Magic link URL
        login_url = f"{self.app_url}/auth/magic-link?token={magic_link}"
        if redirect_url:
            login_url += f"&redirect={redirect_url}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Giriş Linki</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 {self.app_name}</h1>
                </div>
                <div class="content">
                    <h2>Merhaba!</h2>
                    <p>GDPR Hub Lite hesabınıza giriş yapmak için aşağıdaki linke tıklayın:</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{login_url}" class="button">Giriş Yap</a>
                    </p>
                    <p><strong>Bu link 15 dakika geçerlidir.</strong></p>
                    <p>Eğer bu emaili siz talep etmediyseniz, lütfen dikkate almayın.</p>
                </div>
                <div class="footer">
                    <p>Bu email {self.app_name} tarafından gönderilmiştir.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Merhaba!
        
        GDPR Hub Lite hesabınıza giriş yapmak için aşağıdaki linke tıklayın:
        
        {login_url}
        
        Bu link 15 dakika geçerlidir.
        
        Eğer bu emaili siz talep etmediyseniz, lütfen dikkate almayın.
        
        Bu email {self.app_name} tarafından gönderilmiştir.
        """
        
        return self.send_email(to_email, subject, html_content, text_content)
    
    def send_verification_email(self, to_email: str, verification_link: str) -> bool:
        """Email verification gönderme"""
        subject = f"✅ {self.app_name} - Email Doğrulama"
        
        verification_url = f"{self.app_url}/auth/verify?token={verification_link}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Doğrulama</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ {self.app_name}</h1>
                </div>
                <div class="content">
                    <h2>Email Adresinizi Doğrulayın</h2>
                    <p>GDPR Hub Lite hesabınızı aktifleştirmek için email adresinizi doğrulayın:</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{verification_url}" class="button">Email Doğrula</a>
                    </p>
                    <p><strong>Bu link 24 saat geçerlidir.</strong></p>
                </div>
                <div class="footer">
                    <p>Bu email {self.app_name} tarafından gönderilmiştir.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Email Adresinizi Doğrulayın
        
        GDPR Hub Lite hesabınızı aktifleştirmek için email adresinizi doğrulayın:
        
        {verification_url}
        
        Bu link 24 saat geçerlidir.
        
        Bu email {self.app_name} tarafından gönderilmiştir.
        """
        
        return self.send_email(to_email, subject, html_content, text_content)
    
    def send_password_reset(self, to_email: str, reset_link: str) -> bool:
        """Password reset email gönderme"""
        subject = f"🔒 {self.app_name} - Şifre Sıfırlama"
        
        reset_url = f"{self.app_url}/auth/reset-password?token={reset_link}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Şifre Sıfırlama</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 {self.app_name}</h1>
                </div>
                <div class="content">
                    <h2>Şifre Sıfırlama</h2>
                    <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" class="button">Şifre Sıfırla</a>
                    </p>
                    <p><strong>Bu link 1 saat geçerlidir.</strong></p>
                    <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, lütfen dikkate almayın.</p>
                </div>
                <div class="footer">
                    <p>Bu email {self.app_name} tarafından gönderilmiştir.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Şifre Sıfırlama
        
        Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
        
        {reset_url}
        
        Bu link 1 saat geçerlidir.
        
        Eğer şifre sıfırlama talebinde bulunmadıysanız, lütfen dikkate almayın.
        
        Bu email {self.app_name} tarafından gönderilmiştir.
        """
        
        return self.send_email(to_email, subject, html_content, text_content)

# Global email service instance
email_service = EmailService()





