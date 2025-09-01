import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
from datetime import datetime

class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@gdprhublite.com")
    
    async def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """E-posta gönder"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                if self.smtp_user and self.smtp_password:
                    server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            return False
    
    async def send_dsar_confirmation(self, to_email: str, request_id: int, subject_name: str) -> bool:
        """DSAR onay e-postası"""
        subject = "DSAR Talebiniz Alındı"
        html_content = self._generate_dsar_confirmation_template(request_id, subject_name)
        return await self.send_email(to_email, subject, html_content)
    
    async def send_dsar_completion(self, to_email: str, request_id: int, download_url: str) -> bool:
        """DSAR tamamlama e-postası"""
        subject = "DSAR Talebiniz Tamamlandı"
        html_content = self._generate_dsar_completion_template(request_id, download_url)
        return await self.send_email(to_email, subject, html_content)
    
    async def send_dsar_reminder(self, to_email: str, request_id: int, days_remaining: int) -> bool:
        """DSAR hatırlatma e-postası"""
        subject = f"DSAR Hatırlatması - {days_remaining} gün kaldı"
        html_content = self._generate_dsar_reminder_template(request_id, days_remaining)
        return await self.send_email(to_email, subject, html_content)
    
    async def send_admin_notification(self, to_email: str, request_id: int, action: str) -> bool:
        """Admin bildirim e-postası"""
        subject = f"DSAR Güncellemesi - {action}"
        html_content = self._generate_admin_notification_template(request_id, action)
        return await self.send_email(to_email, subject, html_content)
    
    async def send_magic_link_email(self, to_email: str, magic_link: str, user_name: str) -> bool:
        """Magic link e-postası"""
        subject = "GDPR Hub Lite - Giriş Linki"
        html_content = self._generate_magic_link_template(magic_link, user_name)
        return await self.send_email(to_email, subject, html_content)
    
    def _generate_dsar_confirmation_template(self, request_id: int, subject_name: str) -> str:
        """DSAR onay şablonu"""
        return f"""
        <html>
        <body>
            <h2>DSAR Talebiniz Alındı</h2>
            <p>Sayın {subject_name},</p>
            <p>DSAR talebiniz başarıyla alınmıştır. Talep numaranız: <strong>{request_id}</strong></p>
            <p>30 gün içinde size yanıt vereceğiz.</p>
            <p>Teşekkürler,<br>GDPR Hub Lite</p>
        </body>
        </html>
        """
    
    def _generate_dsar_completion_template(self, request_id: int, download_url: str) -> str:
        """DSAR tamamlama şablonu"""
        return f"""
        <html>
        <body>
            <h2>DSAR Talebiniz Tamamlandı</h2>
            <p>DSAR talebiniz tamamlanmıştır. Talep numaranız: <strong>{request_id}</strong></p>
            <p><a href="{download_url}">Verilerinizi indirmek için tıklayın</a></p>
            <p>Teşekkürler,<br>GDPR Hub Lite</p>
        </body>
        </html>
        """
    
    def _generate_dsar_reminder_template(self, request_id: int, days_remaining: int) -> str:
        """DSAR hatırlatma şablonu"""
        return f"""
        <html>
        <body>
            <h2>DSAR Hatırlatması</h2>
            <p>DSAR talebiniz için {days_remaining} gün kaldı. Talep numaranız: <strong>{request_id}</strong></p>
            <p>Teşekkürler,<br>GDPR Hub Lite</p>
        </body>
        </html>
        """
    
    def _generate_admin_notification_template(self, request_id: int, action: str) -> str:
        """Admin bildirim şablonu"""
        return f"""
        <html>
        <body>
            <h2>DSAR Güncellemesi</h2>
            <p>DSAR talebi {request_id} için {action} gerçekleştirildi.</p>
            <p>Teşekkürler,<br>GDPR Hub Lite</p>
        </body>
        </html>
        """
    
    def _generate_magic_link_template(self, magic_link: str, user_name: str) -> str:
        """Magic link şablonu"""
        return f"""
        <html>
        <body>
            <h2>GDPR Hub Lite - Giriş Linki</h2>
            <p>Merhaba {user_name},</p>
            <p>GDPR Hub Lite hesabınıza giriş yapmak için aşağıdaki linke tıklayın:</p>
            <p><a href="{magic_link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Giriş Yap</a></p>
            <p>Bu link 30 dakika geçerlidir.</p>
            <p>Eğer bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.</p>
            <p>Teşekkürler,<br>GDPR Hub Lite</p>
        </body>
        </html>
        """
