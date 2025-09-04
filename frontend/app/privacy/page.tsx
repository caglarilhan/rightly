import { NextPage } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PrivacyPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
            Privacy Policy
          </h1>
          
          <Card className="p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-slate-600 mb-6">
                GDPR Hub Lite ("we", "our", or "us") is committed to protecting your privacy and ensuring compliance with the General Data Protection Regulation (GDPR). This Privacy Policy explains how we collect, use, and protect your personal data.
              </p>

              <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">2.1 Account Information</h3>
                <ul className="list-disc pl-6 text-slate-600 mb-4">
                  <li>Shop domain and access tokens</li>
                  <li>Contact information (email, name)</li>
                  <li>Subscription and billing information</li>
                </ul>
                
                <h3 className="text-lg font-medium mb-2">2.2 DSAR Processing Data</h3>
                <ul className="list-disc pl-6 text-slate-600 mb-4">
                  <li>DSAR request details and customer information</li>
                  <li>Export files and audit logs</li>
                  <li>Processing timestamps and status</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">3.1 Service Provision</h3>
                <ul className="list-disc pl-6 text-slate-600 mb-4">
                  <li>Process DSAR requests and generate exports</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Manage subscriptions and billing</li>
                </ul>
                
                <h3 className="text-lg font-medium mb-2">3.2 Legal Compliance</h3>
                <ul className="list-disc pl-6 text-slate-600 mb-4">
                  <li>Maintain audit trails for GDPR compliance</li>
                  <li>Respond to legal requests and investigations</li>
                  <li>Enforce our terms of service</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
              <div className="mb-6">
                <ul className="list-disc pl-6 text-slate-600">
                  <li><strong>Export files:</strong> 30 days from creation</li>
                  <li><strong>Audit logs:</strong> 12 months from activity</li>
                  <li><strong>Account data:</strong> Until account deletion</li>
                  <li><strong>Billing records:</strong> 7 years (legal requirement)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-slate-600 mb-6">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>End-to-end encryption (TLS 1.2+)</li>
                <li>Data encryption at rest (AES-256)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers with physical security</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">
                Under GDPR, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right of Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Right of Erasure:</strong> Request deletion of your data</li>
                <li><strong>Right of Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Object:</strong> Object to processing of your data</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
              <p className="text-slate-600 mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li><strong>Cloudflare R2:</strong> File storage and delivery</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Shopify:</strong> E-commerce platform integration</li>
                <li><strong>PostHog:</strong> Analytics and monitoring</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">8. International Transfers</h2>
              <p className="text-slate-600 mb-6">
                Your data is processed within the European Union (EU) and European Economic Area (EEA). Any international transfers comply with GDPR requirements and use appropriate safeguards.
              </p>

              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <p className="text-slate-600 mb-2">
                  <strong>Data Protection Officer:</strong><br />
                  Email: dpo@gdpr-hub-lite.com<br />
                  Address: [Your Business Address]
                </p>
                <p className="text-slate-600">
                  <strong>General Inquiries:</strong><br />
                  Email: privacy@gdpr-hub-lite.com<br />
                  Response time: 48 hours
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="text-slate-600 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <div className="bg-brand-50 p-4 rounded-lg">
                <p className="text-brand-800 text-sm">
                  <strong>Note:</strong> This privacy policy is for informational purposes only and does not constitute legal advice. Please consult with a legal professional for specific GDPR compliance requirements.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
