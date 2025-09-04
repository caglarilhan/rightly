import { NextPage } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const SupportPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
            Support & Help Center
          </h1>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900">What is GDPR DSAR?</h3>
                  <p className="text-slate-600 mt-1">
                    GDPR DSAR (Data Subject Access Request) is a legal right that allows individuals to request access to their personal data held by organizations.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">How long does DSAR processing take?</h3>
                  <p className="text-slate-600 mt-1">
                    GDPR requires organizations to respond within 30 days. Our platform helps you meet this deadline efficiently.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">What data formats do you support?</h3>
                  <p className="text-slate-600 mt-1">
                    We export data in PDF, JSON, and CSV formats with comprehensive audit logs.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Is my data secure?</h3>
                  <p className="text-slate-600 mt-1">
                    Yes, we use enterprise-grade encryption and follow GDPR security requirements.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900">Email Support</h3>
                  <p className="text-slate-600 mt-1">
                    <a href="mailto:support@gdpr-hub-lite.com" className="text-brand-600 hover:text-brand-700">
                      support@gdpr-hub-lite.com
                    </a>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Response time: 24 hours</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Documentation</h3>
                  <p className="text-slate-600 mt-1">
                    <a href="https://docs.gdpr-hub-lite.com" className="text-brand-600 hover:text-brand-700">
                      docs.gdpr-hub-lite.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Status Page</h3>
                  <p className="text-slate-600 mt-1">
                    <a href="https://status.gdpr-hub-lite.com" className="text-brand-600 hover:text-brand-700">
                      status.gdpr-hub-lite.com
                    </a>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-slate-900">Install App</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Install from Shopify App Store
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-slate-900">Configure Portal</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Add DSAR portal to your store
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-slate-900">Process Requests</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Automatically handle DSAR requests
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
