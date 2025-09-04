// app/changelog/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Bug, Shield } from "lucide-react";

const changelog = [
  {
    version: "v1.0.0",
    date: "2024-01-15",
    title: "Admin Panel v0 Launch",
    type: "new",
    description: "Complete RBAC system with 'Sınırsız Mod' impersonation",
    features: [
      "Role-based access control (RBAC)",
      "User impersonation with audit logging",
      "Feature flag management",
      "Comprehensive audit trail",
      "Admin dashboard with real-time metrics"
    ]
  },
  {
    version: "v0.9.0",
    date: "2024-01-14",
    title: "Enhanced Security & Performance",
    type: "improved",
    description: "Major security improvements and performance optimizations",
    features: [
      "Rate limiting on all endpoints",
      "Enhanced audit logging",
      "Security headers implementation",
      "Database query optimization",
      "Frontend performance improvements"
    ]
  },
  {
    version: "v0.8.0",
    date: "2024-01-13",
    title: "DSAR Management Improvements",
    type: "improved",
    description: "Better DSAR request handling and reporting",
    features: [
      "Improved request status tracking",
      "Enhanced export functionality",
      "Better error handling",
      "UI/UX improvements",
      "Mobile responsiveness fixes"
    ]
  },
  {
    version: "v0.7.0",
    date: "2024-01-12",
    title: "Shopify Integration",
    type: "new",
    description: "Seamless Shopify store integration for DSAR automation",
    features: [
      "Automatic customer data discovery",
      "Shopify webhook integration",
      "Real-time data sync",
      "Compliance reporting",
      "Data export automation"
    ]
  },
  {
    version: "v0.6.0",
    date: "2024-01-11",
    title: "Bug Fixes & Stability",
    type: "fixed",
    description: "Various bug fixes and stability improvements",
    features: [
      "Fixed authentication issues",
      "Resolved data export problems",
      "Improved error messages",
      "Better loading states",
      "General stability improvements"
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "new":
      return <Sparkles className="h-4 w-4" />;
    case "improved":
      return <Zap className="h-4 w-4" />;
    case "fixed":
      return <Bug className="h-4 w-4" />;
    case "security":
      return <Shield className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "improved":
      return "bg-green-100 text-green-800 border-green-200";
    case "fixed":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "security":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Changelog</h1>
        <p className="text-lg text-slate-600">
          Track all updates, improvements, and new features
        </p>
      </div>

      {/* Changelog List */}
      <div className="space-y-6">
        {changelog.map((entry, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor(entry.type)}>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(entry.type)}
                      {entry.type}
                    </div>
                  </Badge>
                  <div>
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    <CardDescription>
                      {entry.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{entry.version}</div>
                  <div className="text-sm text-slate-500">{entry.date}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {entry.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Stay Updated</h3>
            <p className="text-slate-600 mb-4">
              Get notified about new features and updates
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span>📧 Follow us on Twitter</span>
              <span>•</span>
              <span>📱 Join our Discord</span>
              <span>•</span>
              <span>📖 Read our blog</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
