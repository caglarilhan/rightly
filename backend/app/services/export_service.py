import zipfile
import json
import csv
import io
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import hashlib
from app.models import DSARRequest, ExportBundle, ExportFormat
from app.core.config import settings
import boto3
import logging

logger = logging.getLogger(__name__)

class ExportService:
    """Export bundle oluşturma servisi"""
    
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=settings.R2_ENDPOINT_URL,
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY
        )
    
    async def create_export_bundle(self, request: DSARRequest, data: Dict[str, Any]) -> Optional[str]:
        """DSAR talebi için export bundle oluştur"""
        
        # ZIP dosyası oluştur
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # JSON export
            json_data = self._format_json_export(request, data)
            zip_file.writestr('data.json', json.dumps(json_data, indent=2, default=str))
            
            # CSV export
            csv_data = self._format_csv_export(request, data)
            zip_file.writestr('data.csv', csv_data)
            
            # PDF rapor
            pdf_content = self._generate_pdf_report(request, data)
            zip_file.writestr('report.pdf', pdf_content)
            
            # Metadata
            metadata = {
                'request_id': request.id,
                'created_at': datetime.utcnow().isoformat(),
                'subject_email': request.subject_email,
                'request_type': request.request_type.value,
                'data_sources': list(data.keys()),
                'total_records': sum(len(v) if isinstance(v, list) else 1 for v in data.values())
            }
            zip_file.writestr('metadata.json', json.dumps(metadata, indent=2))
        
        # S3'e yükle
        zip_buffer.seek(0)
        file_key = f"exports/request_{request.id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.zip"
        
        self.s3_client.upload_fileobj(
            zip_buffer,
            settings.R2_BUCKET_NAME,
            file_key,
            ExtraArgs={
                'ContentType': 'application/zip',
                'Metadata': {
                    'request_id': str(request.id),
                    'subject_email': request.subject_email,
                    'created_at': datetime.utcnow().isoformat()
                }
            }
        )
        
        # Checksum hesapla
        zip_buffer.seek(0)
        checksum = hashlib.sha256(zip_buffer.read()).hexdigest()
        
        # Export bundle kaydet
        export_bundle = ExportBundle(
            request_id=request.id,
            format=ExportFormat.ZIP,
            file_path=file_key,
            file_size=zip_buffer.tell(),
            checksum=checksum,
            meta_data=json.dumps(metadata),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        
        return export_bundle
    
    def _format_json_export(self, request: DSARRequest, data: Dict[str, Any]) -> Dict[str, Any]:
        """JSON formatında export hazırla"""
        return {
            'request_info': {
                'id': request.id,
                'type': request.request_type.value,
                'status': request.status.value,
                'created_at': request.created_at.isoformat(),
                'due_date': request.due_date.isoformat(),
                'subject_email': request.subject_email,
                'subject_name': request.subject_name
            },
            'data': data,
            'export_info': {
                'exported_at': datetime.utcnow().isoformat(),
                'format': 'json',
                'version': '1.0'
            }
        }
    
    def _format_csv_export(self, request: DSARRequest, data: Dict[str, Any]) -> str:
        """CSV formatında export hazırla"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['Source', 'Field', 'Value'])
        
        # Data
        for source, source_data in data.items():
            if isinstance(source_data, list):
                for item in source_data:
                    if isinstance(item, dict):
                        for field, value in item.items():
                            writer.writerow([source, field, str(value)])
                    else:
                        writer.writerow([source, 'data', str(item)])
            elif isinstance(source_data, dict):
                for field, value in source_data.items():
                    writer.writerow([source, field, str(value)])
            else:
                writer.writerow([source, 'data', str(source_data)])
        
        return output.getvalue()
    
    def _generate_pdf_report(self, request: DSARRequest, data: Dict[str, Any]) -> str:
        """PDF rapor oluştur"""
        # Basit HTML rapor (gerçek PDF için reportlab kullanılabilir)
        html_content = f"""
        <html>
        <head>
            <title>GDPR DSAR Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .header {{ background: #f8f9fa; padding: 20px; border-radius: 8px; }}
                .section {{ margin: 20px 0; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🛡️ GDPR DSAR Report</h1>
                <p><strong>Request ID:</strong> {request.id}</p>
                <p><strong>Subject:</strong> {request.subject_email}</p>
                <p><strong>Type:</strong> {request.request_type.value}</p>
                <p><strong>Generated:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
            
            <div class="section">
                <h2>Data Summary</h2>
                <table>
                    <tr>
                        <th>Source</th>
                        <th>Records</th>
                        <th>Fields</th>
                    </tr>
                    {self._generate_data_summary_rows(data)}
                </table>
            </div>
            
            <div class="section">
                <h2>Compliance Information</h2>
                <p>This report was generated in compliance with GDPR Article 15 (Right of Access).</p>
                <p>The data subject has the right to:</p>
                <ul>
                    <li>Access their personal data</li>
                    <li>Know the purpose of processing</li>
                    <li>Know the recipients of their data</li>
                    <li>Know the retention period</li>
                </ul>
            </div>
        </body>
        </html>
        """
        
        return html_content
    
    def _generate_data_summary_rows(self, data: Dict[str, Any]) -> str:
        """Data summary tablosu için satırlar oluştur"""
        rows = []
        for source, source_data in data.items():
            if isinstance(source_data, list):
                records = len(source_data)
                fields = len(source_data[0]) if source_data and isinstance(source_data[0], dict) else 1
            elif isinstance(source_data, dict):
                records = 1
                fields = len(source_data)
            else:
                records = 1
                fields = 1
            
            rows.append(f'<tr><td>{source}</td><td>{records}</td><td>{fields}</td></tr>')
        
        return '\n'.join(rows)
    
    async def get_export_download_url(self, export_bundle: ExportBundle) -> str:
        """Export bundle için download URL oluştur"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': settings.R2_BUCKET_NAME,
                    'Key': export_bundle.file_path
                },
                ExpiresIn=3600  # 1 saat geçerli
            )
            return url
        except Exception as e:
            logger.error(f"Error generating download URL: {e}")
            return None

