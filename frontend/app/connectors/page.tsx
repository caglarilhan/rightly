import { NextPage } from "next";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Mail, 
  HardDrive, 
  MessageSquare, 
  Cloud,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from "lucide-react";

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "connected" | "disconnected" | "available";
  plan: "free" | "pro" | "enterprise";
  features: string[];
}

const ConnectorsPage: NextPage = () => {
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: "gmail",
      name: "Gmail",
      description: "Automatically send export links via email",
      icon: Mail,
      status: "available",
      plan: "pro",
      features: ["Auto email notifications", "Export link sharing", "Template customization"]
    },
    {
      id: "drive",
      name: "Google Drive",
      description: "Store exports directly in Google Drive",
      icon: HardDrive,
      status: "available",
      plan: "pro",
      features: ["Auto upload to Drive", "Folder organization", "Share with team"]
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get instant notifications in Slack channels",
      icon: MessageSquare,
      status: "available",
      plan: "enterprise",
      features: ["Channel notifications", "Team alerts", "Custom webhooks"]
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Enterprise file storage integration",
      icon: Cloud,
      status: "available",
      plan: "enterprise",
      features: ["Enterprise storage", "Team collaboration", "Advanced security"]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "available":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      case "available":
        return "Available";
      default:
        return "Unknown";
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "free":
        return <Badge variant="secondary">Free</Badge>;
      case "pro":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Pro</Badge>;
      case "enterprise":
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const connectConnector = (id: string) => {
    setConnectors(prev => 
      prev.map(connector => 
        connector.id === id 
          ? { ...connector, status: "connected" as const }
          : connector
      )
    );
  };

  const disconnectConnector = (id: string) => {
    setConnectors(prev => 
      prev.map(connector => 
        connector.id === id 
          ? { ...connector, status: "disconnected" as const }
          : connector
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations & Connectors</h1>
            <p className="text-slate-600">
              Connect your GDPR Hub with your favorite tools and automate your DSAR workflow
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Connected</p>
                  <p className="text-2xl font-bold text-green-600">
                    {connectors.filter(c => c.status === "connected").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Available</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {connectors.filter(c => c.status === "available").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pro Features</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {connectors.filter(c => c.plan === "pro").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Enterprise</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {connectors.filter(c => c.plan === "enterprise").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connectors.map((connector) => {
              const Icon = connector.icon;
              return (
                <Card key={connector.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{connector.name}</h3>
                        <p className="text-sm text-slate-600">{connector.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(connector.status)}
                      <span className="text-sm text-slate-600">
                        {getStatusText(connector.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    {getPlanBadge(connector.plan)}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {connector.features.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    {connector.status === "available" && (
                      <Button 
                        onClick={() => connectConnector(connector.id)}
                        className="flex-1"
                      >
                        Connect {connector.name}
                      </Button>
                    )}
                    {connector.status === "connected" && (
                      <Button 
                        variant="outline"
                        onClick={() => disconnectConnector(connector.id)}
                        className="flex-1"
                      >
                        Disconnect
                      </Button>
                    )}
                    {connector.plan !== "free" && (
                      <Button variant="outline" size="sm">
                        Upgrade Plan
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Upgrade CTA */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Unlock Premium Integrations
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Upgrade to Pro or Enterprise to connect with Gmail, Google Drive, Slack, and more. 
                Automate your DSAR workflow and never miss a request again.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">
                  Upgrade to Pro - €49/month
                </Button>
                <Button variant="outline" size="lg">
                  View Enterprise Plans
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConnectorsPage;
